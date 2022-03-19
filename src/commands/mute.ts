import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
import ms from "ms";
import { moderationLogger } from "..";
import Mutes from "../models/mutes";
import SlashCommand from "../structures/Command";

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
        )
        .addStringOption((option) =>
          option
            .setName("duration")
            .setDescription(
              "The duration of the ban. EX: (2 days, 1d, 10h, 2.5 hrs, 1m, 5s, 1y)"
            )
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
    const userToMute = interaction.guild.members.cache.get(
      interaction.options.getUser("user").id
    );

    const durationOption = interaction.options.getString("duration");
    const duration = ms(durationOption);

    const reason = interaction.options.getString("reason");

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

    // check if user already has mute role
    if (userToMute.roles.cache.has("953053708994875526")) {
      return interaction.reply({
        content: "User is already muted.",
        ephemeral: true,
      });
    }

    userToMute.roles
      .add("954201144480104458")
      .then(async () => {
        const mute = await Mutes.create({
          user: userToMute.id,
          moderator: (interaction.member as GuildMember).id,
          duration,
          reason,
        });

        await mute.save();

        setTimeout(async () => {
          await userToMute.roles.remove("954201144480104458");
        }, duration);

        await userToMute.send({
          embeds: [
            new MessageEmbed()
              .setTitle("You have been mute in APandas.")
              .setDescription(
                " " + mute.duration &&
                  `You will be un-muted on ${new Date(
                    Date.parse(mute.createdAt) + mute.duration
                  ).toLocaleDateString()}`
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

        moderationLogger.mute(
          userToMute,
          interaction.user,
          reason,
          durationOption
        );

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
              .setTitle("Mute Failed")
              .setDescription(
                `${userToMute.displayName} could not be muted. ${e}`
              ),
          ],
          ephemeral: true,
        });
      });
  }
}
