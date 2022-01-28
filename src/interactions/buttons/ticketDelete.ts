import { ButtonInteraction } from "discord.js";
import Logger from "../../lib/utils/logger";

import ticketSaveTranscript from "./ticketSaveTranscript";

export default async function (interaction: ButtonInteraction, logger: Logger) {
	await ticketSaveTranscript(interaction, logger);
	await interaction.channel.delete();
}