import { ButtonInteraction } from "discord.js";

import ticketSaveTranscript from "./ticketSaveTranscript";

export default async function (interaction: ButtonInteraction) {
	await ticketSaveTranscript(interaction);
	await interaction.channel.delete();
}