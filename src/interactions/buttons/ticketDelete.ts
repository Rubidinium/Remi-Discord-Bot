import { ButtonInteraction, TextChannel } from "discord.js";
import { deleteTranscriptEntry } from "../../lib/utils/notion";

export default async function (interaction: ButtonInteraction) {
	const channel = interaction.channel as TextChannel;

	deleteTranscriptEntry((channel.name.split("-"))[channel.name.split("-").length - 1]).catch();

	interaction.channel.delete();

}