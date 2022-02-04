import SlashCommand from "../structures/Command";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

export default class ScheduleCommand extends SlashCommand {
  constructor() {
    super(
      new SlashCommandBuilder()
        .setName("schedule")
        .setDescription("Create a tutoring session.")
        .addStringOption((option) =>
          option
            .setRequired(true)
            .setName("date")
            .setDescription(
              "Enter a date in the format MM/DD. EX: (02/05) would be February 5th."
            )
        )
        .addStringOption((option) =>
          option
            .setRequired(true)
            .setName("time")
            .setDescription(
              "Enter a time in the format 24 hour in EST. EX: (14:00) would be 02:00 PM."
            )
        )
        .addUserOption((option) =>
          option
            .setRequired(true)
            .setDescription(
              "Enter the student you will be tutoring for this session."
            )
        ),
      [
        {
          // id: "tutor_id_here",
          id: "924860504487366723",
          type: "ROLE",
          permission: true,
        },
      ]
    );
  }

  async exec(interaction: CommandInteraction) {
    await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setTitle("Example title")
          .setDescription("Example description here"),
      ],
    });
  }
}
