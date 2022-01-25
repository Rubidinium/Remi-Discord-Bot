import { ButtonInteraction, MessageAttachment, TextChannel } from "discord.js";
import { createTranscript } from "../../lib/transcripts";


export default async function (interaction: ButtonInteraction) {
	const transcriptFile = await createTranscript(interaction.channel) as MessageAttachment;

	interaction.reply({
		files: [new MessageAttachment(transcriptFile.attachment, (interaction.channel as TextChannel).name + ".html")]
	});
}