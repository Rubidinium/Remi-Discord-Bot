import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
import { configIds, moderationLogger } from "..";
import SlashCommand from "../structures/Command";

export default class KickCommand extends SlashCommand {
  constructor() {
    super(
      new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kicks the specified user from the server.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to kick.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("The reason for the kick.")
            .setRequired(true)
        ),
      [
        {
          // moderator role
          id: configIds.moderatorRole,
          type: "ROLE",
          permission: true,
        },
      ]
    );
  }

  async exec(interaction: CommandInteraction) {
    const userToKick = interaction.guild.members.cache.get(
      interaction.options.getUser("user").id
    );

    if (!userToKick) {
      return interaction.reply({
        content:
          "User is not in the server. Please try again with a valid user.",
        ephemeral: true,
      });
    }

    if (userToKick.id === (interaction.member as GuildMember).id) {
      return interaction.reply({
        content: "You can't kick yourself.",
        ephemeral: true,
      });
    }

    if (userToKick.id === interaction.client.user.id) {
      return interaction.reply({
        content: "I can't kick myself.",
        ephemeral: true,
      });
    }

    if (userToKick.id === interaction.guild.ownerId) {
      return interaction.reply({
        content: "I can't kick the server owner.",
        ephemeral: true,
      });
    }

    if (
      userToKick.roles.highest.position >=
      (interaction.member as GuildMember).roles.highest.position
    ) {
      return interaction.reply({
        content: "You can't kick someone with a higher or equal role than you.",
        ephemeral: true,
      });
    }

    const reason = interaction.options.getString("reason");

    userToKick
      .kick(reason)
      .then(async () => {
        await userToKick.send({
          embeds: [
            new MessageEmbed()
              .setTitle("You have been kicked from APandas.")
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
              ]),
          ],
        });

        moderationLogger.kick(userToKick, interaction.user, reason);

        interaction.reply({
          embeds: [
            new MessageEmbed().setTitle("User kicked").setFields([
              {
                name: "User",
                value: userToKick.toString(),
                inline: true,
              },
              {
                name: "Reason",
                value: reason,
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
              .setTitle("Kick Failed")
              .setDescription(
                `${userToKick.displayName} could not be kicked. ${e}`
              ),
          ],
          ephemeral: true,
        });
      });
  }
}
