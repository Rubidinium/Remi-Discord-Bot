import SlashCommand from "../structures/Command";
import {
  CommandInteraction,
  GuildMember,
  MessageEmbed,
  User,
} from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { moderationLogger } from "..";
import ms from "ms";

export default class ExampleCommand extends SlashCommand {
  constructor() {
    super(
      new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Bans the specified user from the server.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to ban.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("duration")
            .setDescription("The duration of the ban.")
            .setRequired(false)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("The reason for the kick.")
            .setRequired(false)
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
    const userToBan = await interaction.guild.members.fetch(
      interaction.options.getUser("user")
    );
    const duration = interaction.options.getString("duration");
    const reason =
      interaction.options.getString("reason") ?? "No reason given.";

    if (!userToBan) {
      return interaction.reply({
        content:
          "User is not in the server. Please try again with a valid user.",
        ephemeral: true,
      });
    }

    if (userToBan.id === (interaction.member as GuildMember).id) {
      return interaction.reply({
        content: "You can't ban yourself.",
        ephemeral: true,
      });
    }

    if (userToBan.id === interaction.client.user.id) {
      return interaction.reply({
        content: "I can't ban myself.",
        ephemeral: true,
      });
    }

    if (userToBan.id === interaction.guild.ownerId) {
      return interaction.reply({
        content: "I can't ban the server owner.",
        ephemeral: true,
      });
    }

    if (
      userToBan.roles.highest.position >=
      (interaction.member as GuildMember).roles.highest.position
    ) {
      return interaction.reply({
        content: "You can't ban someone with a higher or equal role than you.",
        ephemeral: true,
      });
    }

    // store the user ban timer

    userToBan
      .ban({ reason })
      .then(async () => {
        await userToBan.send({
          embeds: [
            new MessageEmbed()
              .setTitle("You have been banned from APandas.")
              .setDescription(
                "To appeal, join the support server: https://discord.gg/VDTdzAaTjE"
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
              ]),
          ],
        });

        moderationLogger.ban(userToBan, interaction.user, reason);

        interaction.reply({
          embeds: [
            new MessageEmbed()
              .setColor("#00ff00")
              .setTitle("User Baned.")
              .setFields([
                {
                  name: "User",
                  value: userToBan.toString(),
                  inline: true,
                },
                {
                  name: "Reason",
                  value: reason,
                  inline: true,
                },
                {
                  name: "Duration",
                  value: duration,
                  inline: true,
                },
              ])
              .setTimestamp(),
          ],
          ephemeral: true,
        });
      })
      .catch((e) => {
        interaction.reply({
          embeds: [
            new MessageEmbed()
              .setColor("#ff0000")
              .setTitle("Ban Failed.")
              .setDescription(
                `${userToBan.displayName} could not be baned. ${e}`
              ),
          ],
          ephemeral: true,
        });
      });
  }
}
