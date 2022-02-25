import SlashCommand from "../structures/Command";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { Embed, SlashCommandBuilder } from "@discordjs/builders";
import Schedules, { scheduleSchema } from "../models/schedule";

export default class ScheduleCommand extends SlashCommand {
  constructor() {
    super(
      new SlashCommandBuilder()
        .setName("schedule")
        .setDescription("Commands for scheduling a session")
        .addSubcommand((subCommand) =>
          subCommand
            .setName("create")
            .setDescription("Creates a new tutoring session")
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
            )
        )
        .addSubcommand((subCommand) =>
          subCommand
            .setName("view")
            .setDescription("View your scheduled session(s).")
            .addStringOption((option) =>
              option
                .setName("id")
                .setDescription(
                  "Enter the ID of the session you want to view. Leave blank to view all sessions."
                )
            )
        )
        .addSubcommand((subCommand) =>
          subCommand
            .setName("skip")
            .setDescription("Skip a scheduled session.")
            .addStringOption((option) =>
              option
                .setName("id")
                .setDescription("Enter the ID of the session you want to skip")
                .setRequired(true)
            )
        )
        .addSubcommand((subCommand) =>
          subCommand
            .setName("delete")
            .setDescription("Delete your scheduled session(s).")
            .addStringOption((option) =>
              option
                .setName("id")
                .setDescription(
                  "Enter the ID of the session you want to delete. Leave blank to delete all sessions."
                )
            )
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
    switch (interaction.options.getSubcommand()) {
      case "create": {
        const date = interaction.options.getString("date");
        const month = parseInt(date.split("/")[0]);
        const day = parseInt(date.split("/")[1]);

        const time = interaction.options.getString("time");
        const hours = parseInt(time.split(":")[0]);
        const minutes = parseInt(time.split(":")[1]);

        const student = interaction.options.getUser("student");
        const subject = interaction.options.getString("subject") || "N/A";

        const date2 = new Date();

        date2.setMonth(month - 1, day);
        date2.setHours(hours, minutes, 0, 0);

        const schedule = await Schedules.create({
          tutor: interaction.user.id,
          student: student.id,
          date: date2,
          subject,
        });

        await schedule.save();


        const embed = new MessageEmbed()
          .setTitle("Tutoring Session Created")
          .addFields([
            {
              name: "ID",
              value: schedule._id.toString(),
            },
            {
              name: "Tutor",
              value: interaction.user.toString(),
            },
            {
              name: "Student",
              value: student.toString(),
            },
            {
              name: "Date",
              value: `<t:${date2.getTime() / 1000}>`,
            },
            {
              name: "Subject",
              value: subject,
            },
          ]);

        await interaction.reply({
          embeds: [embed],
          ephemeral: true,
        });

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
                    value: subject,
                    inline: true,
                  },
                ]),
            ],
          };
          Promise.all([
            student.send(message),
            interaction.user.send(message),
          ]).then(async () => {
            const deleteRes = await Schedules.deleteOne({
              tutor: interaction.user.id,
              student: student.id,
              date: date2,
              subject,
            });
          });
        }, date2.getTime() - Date.now());

        break;
      }
      case "view": {
        const id = interaction.options.getString("id");

        if (id) {
          const schedule = await Schedules.findOne({
            _id: id,
          });
          if (!schedule) {
            await interaction.reply("No session with that ID exists.");
            return;
          }
          const embed = sessionEmbed(schedule);
          await interaction.reply({
            embeds: [embed],
            ephemeral: true,
          });
        } else {
          const schedules = await Schedules.find({
            tutor: interaction.user.id,
          });
          if (schedules.length === 0) {
            await interaction.reply({
              content: "You have no scheduled sessions.",
              ephemeral: true,
            });
            return;
          }
          const embeds = schedules.map((schedule) => sessionEmbed(schedule));
          await interaction.reply({
            embeds,
            ephemeral: true,
          });
        }

        break;
      }
      case "skip": {
        const id = interaction.options.getString("id");

        const schedule = await Schedules.findOne({
          _id: id,
        });

        if (!schedule) {
          await interaction.reply({
            content: "No session with that ID exists.",
            ephemeral: true,
          });
          return;
        }

        // add 1 week to the date
        schedule.date = new Date(
          schedule.date.getTime() + 1000 * 60 * 60 * 24 * 7
        );

        await schedule.save();

        const embed = sessionEmbed(schedule);
        await interaction.reply({
          content: "Session has been skipped.",
          embeds: [embed],
          ephemeral: true,
        });

        break;
      }
      case "delete": {
        const id = interaction.options.getString("id");

        if (id) {
          const deleteRes = await Schedules.deleteOne({
            _id: id,
          });
          if (deleteRes.deletedCount === 0) {
            await interaction.reply({
              content: "No session with that ID exists.",
              ephemeral: true,
            });
            return;
          }
          await interaction.reply({
            content: "Session has been deleted.",
            ephemeral: true,
          });
        } else {
          const deleteRes = await Schedules.deleteMany({
            tutor: interaction.user.id,
          });
          if (deleteRes.deletedCount === 0) {
            await interaction.reply({
              content: "You have no scheduled sessions.",
              ephemeral: true,
            });
            return;
          }
          await interaction.reply({
            content: "All scheduled sessions have been deleted.",
            ephemeral: true,
          });
        }

        break;
      }
    }
  }
}

export function sessionEmbed(schedule) {
  return new MessageEmbed().setTitle("Tutoring Session").addFields([
    {
      name: "ID",
      value: schedule._id.toString(),
    },
    {
      name: "Tutor",
      value: `<@${schedule.tutor}>`,
    },
    {
      name: "Student",
      value: `<@${schedule.student}>`,
    },
    {
      name: "Date",
      value: `<t:${new Date(schedule.date).getTime() / 1000}>`,
    },
    {
      name: "Subject",
      value: schedule.subject,
    },
  ]);
}
