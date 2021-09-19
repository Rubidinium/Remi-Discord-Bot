import { SlashCommandBuilder } from "@discordjs/builders";
const command = new SlashCommandBuilder()
  .setName("register")
  .setDescription("Places you in a course");

export default {
  data: command.toJSON(),
  async execute(interaction) {
    console.log(interaction);
    // interaction;
  },
};
