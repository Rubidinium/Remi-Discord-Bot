import SlashCommand from "../structures/Command";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import Schedule from "../models/schedule";

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
              "Enter a date in the format MM/DD. EX: 02/05 would be February 5th."
            )
        )
        .addStringOption((option) =>
          option
            .setRequired(true)
            .setName("time")
            .setDescription(
              "Enter a time in the format 24 hour in PST. EX: 14:00 would be 02:00 PM."
            )
        )
        .addUserOption((option) =>
          option
            .setRequired(true)
            .setName("student")
            .setDescription(
              "Enter the student you will be tutoring for this session."
            )
        )
        .addStringOption((option) =>
          option
            .setName("subject")
            .setDescription("Enter the subject you will be tutoring.")
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
    const date = interaction.options.getString("date");
    const month = parseInt(date.split("/")[0]);
    const day = parseInt(date.split("/")[1]);

    const time = interaction.options.getString("time");
    const hours = parseInt(time.split(":")[0]);
    const minutes = parseInt(time.split(":")[1]);

    const student = interaction.options.getUser("student");
    const subject = interaction.options.getString("subject");

    const embed = new MessageEmbed()
      .setTitle("Tutoring Session Created")
      .setDescription(
        `${interaction.user} is tutoring ${student} on ${date} at ${time} ${
          subject ? `for ${subject}.` : ""
        }`
      );

    const date2 = new Date();
    date2.setMonth(month, day);
    date2.setHours(hours, minutes, 0, 0);

    await Schedule.create({
      tutor: interaction.user.id,
      student: student.id,
      date: date2,
      subject,
    });

    await interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  }
}
