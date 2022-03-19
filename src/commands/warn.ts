import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
import { configIds, moderationLogger } from "..";
import SlashCommand from "../structures/Command";
import Warns from "../models/warns";

export default class MuteCommand extends SlashCommand {
  constructor() {
    super(
      new SlashCommandBuilder()
        .setName("warn")
        .setDescription("Warns the specified user for a specified action.")
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
    const userToWarn = interaction.guild.members.cache.get(
      interaction.options.getUser("user").id
    );

    if (!userToWarn) {
      return interaction.reply({
        content:
          "User is not in the server. Please try again with a valid user.",
        ephemeral: true,
      });
    }

    if (userToWarn.id === (interaction.member as GuildMember).id) {
      return interaction.reply({
        content: "You can't warn yourself.",
        ephemeral: true,
      });
    }

    if (userToWarn.id === interaction.client.user.id) {
      return interaction.reply({
        content: "I can't warn myself.",
        ephemeral: true,
      });
    }

    const reason = interaction.options.getString("reason");

    const warn = await Warns.create({
      user: userToWarn.id,
      moderator: (interaction.member as GuildMember).id,
      reason,
    });

    await warn.save();

    await userToWarn.send({
      embeds: [
        new MessageEmbed()
          .setTitle("You have been warned in APandas.")
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

    moderationLogger.warn(userToWarn, interaction.user, reason);

    interaction.reply({
      embeds: [
        new MessageEmbed().setTitle("User warned").setFields([
          {
            name: "User",
            value: userToWarn.toString(),
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
  }
}
