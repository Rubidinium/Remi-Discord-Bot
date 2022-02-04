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
          // tutor role
          id: "939246116900319312",
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
    console.log(month, day);
    date2.setMonth(month - 1, day);
    console.log(hours, minutes);
    date2.setHours(hours, minutes, 0, 0);

    const schedule = await Schedule.create({
      tutor: interaction.user.id,
      student: student.id,
      date: date2,
      subject,
    });
    await schedule.save();

    await interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
    console.log(date2.getTime() - Date.now());
    setTimeout(() => {
      const message = {
        embeds: [
          new MessageEmbed()
            .setColor("GREEN")
            .setTitle("ALERT: You have a tutoring session coming up!")
            .setDescription(
              "Please make sure you both communicate and set up a private voice channel"
            )
            .setFields([
              {
                name: "Tutor",
                value: interaction.user.toString(),
                inline: true,
              },
              {
                name: "Student",
                value: student.toString(),
                inline: true,
              },
              {
                name: "Time",
                value: time + " PST",
                inline: true,
              },
              {
                name: "Subject",
                value: subject || "N/A",
                inline: true,
              },
            ]),
        ],
      };
      Promise.all([student.send(message), interaction.user.send(message)]).then(
        () => {
          Schedule.deleteOne({
            tutor: interaction.user.id,
            student: student.id,
            date: date2,
            subject,
          });
        }
      );
    }, date2.getTime() - Date.now());
  }
}
