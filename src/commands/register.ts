import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction } from "discord.js";
const command = new SlashCommandBuilder()
    .setName("register")
    .setDescription("Places you in a course");

export default {
    data: command.toJSON(),
    async execute(interaction: CommandInteraction, parent: Client) {

        interaction.reply({
            content: "You are now registered for the course",
            ephemeral: true,
        });
    },
};