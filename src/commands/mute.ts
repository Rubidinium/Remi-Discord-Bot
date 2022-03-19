import SlashCommand from "../structures/Command";
import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { moderationLogger } from "..";
import ms from "ms";
import Mute from "../models/mutes";

export default class MuteCommand extends SlashCommand {
  constructor() {
    super(
      new SlashCommandBuilder()
        .setName("mute")
        .setDescription("Mutes the specified user from the server.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to mute.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("The reason for the mute.")
            .setRequired(true)
        ),
      [
        {
          // moderator role
          id: "953053708994875526",
          type: "ROLE",
          permission: true,
        },
      ]
    );
  }

  async exec(interaction: CommandInteraction) {
    const userToMute = await interaction.guild.members.fetch(
      interaction.options.getUser("user")
    );

    const durationOption = interaction.options.getString("duration");
    const duration = durationOption ? ms(durationOption) : null;

    const reason =
      interaction.options.getString("reason") ?? "No reason given.";

    if (!userToMute) {
      return interaction.reply({
        content:
          "User is not in the server. Please try again with a valid user.",
        ephemeral: true,
      });
    }

    if (userToMute.id === (interaction.member as GuildMember).id) {
      return interaction.reply({
        content: "You can't mute yourself.",
        ephemeral: true,
      });
    }

    if (userToMute.id === interaction.client.user.id) {
      return interaction.reply({
        content: "I can't mute myself.",
        ephemeral: true,
      });
    }

    if (userToMute.id === interaction.guild.ownerId) {
      return interaction.reply({
        content: "I can't mute the server owner.",
        ephemeral: true,
      });
    }

    userToMute.roles
      .add("954201144480104458")
      .then(async () => {
        const mute = await Mute.create({
          user: userToMute.id,
          moderator: (interaction.member as GuildMember).id,
          duration,
          reason,
        });

        await mute.save();

        setTimeout(async () => {
          await userToMute.roles.remove("954201144480104458");
          await Mute.deleteOne(mute);
        }, duration);

        await userToMute.send({
          embeds: [
            new MessageEmbed()
              .setTitle("You have been mute in APandas.")
              .setDescription(
                " " + mute.duration &&
                  `You will be un-muted on ${new Date(
                    mute.createdAt + mute.duration
                  ).toUTCString()}`
              )
              .setFields([
                {
                  name: "Moderator",
                  value: interaction.user.tag,
                  inline: true,
                },
                {
                  name: "Reason",
                  value: reason,
                  inline: true,
                },
                {
                  name: "Duration",
                  value: mute.duration ? durationOption : "Permanent",
                  inline: true,
                },
              ]),
          ],
        });

        moderationLogger.mute(userToMute, interaction.user, reason);

        interaction.reply({
          embeds: [
            new MessageEmbed().setTitle("User Muted.").setFields([
              {
                name: "User",
                value: userToMute.toString(),
                inline: true,
              },
              {
                name: "Reason",
                value: reason,
                inline: true,
              },
              {
                name: "Duration",
                value: durationOption,
                inline: true,
              },
            ]),
          ],
          ephemeral: true,
        });
      })
      .catch((e) => {
        interaction.reply({
          embeds: [
            new MessageEmbed()
              .setTitle("Mute Failed.")
              .setDescription(
                `${userToMute.displayName} could not be muted. ${e}`
              ),
          ],
          ephemeral: true,
        });
      });
  }
}
