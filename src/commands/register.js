import { SlashCommandBuilder } from "@discordjs/builders";
const command = new SlashCommandBuilder()
  .setName("register")
  .setDescription("Places you in a course");

export default {
  data: command.toJSON(),
  async execute(interaction) {

    interaction.reply({
      content: "You are now registered for the course",
      ephemeral: true,
    });
    // interaction;
  },
};
