import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageActionRow, MessageSelectMenu } from "discord.js";
const command = new SlashCommandBuilder()
	.setName("test")
	.setDescription("test");

export default {
	data: command.toJSON(),
	async execute(interaction: CommandInteraction) {
		const row = new MessageActionRow().addComponents(
			new MessageSelectMenu()
				.setCustomId("select")
				.setPlaceholder("Nothing selected")
				.addOptions([
					{
						label: "Web Development",
						value: "web",
					},
					{
						label: "Game Development",
						value: "game",
					},
				])
		);

		await interaction.reply({
			content: "Pong!",
			components: [row],
			ephemeral: true,
		});
	},
};
