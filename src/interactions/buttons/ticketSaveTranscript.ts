import { ButtonInteraction, MessageAttachment, TextChannel } from "discord.js";
import { createTranscript } from "../../lib/transcripts";
import { createTranscriptEntry } from "../../lib/utils/notion";


export default async function (interaction: ButtonInteraction) {
	const transcriptFile = await createTranscript(interaction.channel) as MessageAttachment;

	const channel = interaction.channel as TextChannel;
	const transcript = {
		title: channel.name.split("-")[channel.name.split("-").length - 1],
		category: channel.name.split("-")[0] != "other" && channel.name.split("-")[0],
		htmlString: "" // transcriptFile.attachment.toString()
	};

	try {
		await createTranscriptEntry(transcript);

		interaction.reply({
			files: [new MessageAttachment(transcriptFile.attachment, (interaction.channel as TextChannel).name + ".html")]
		});
	}
	catch (e) {
		console.error(e);
		interaction.reply({ content: "There was an error creating the transcript. Please try again later. If this error persists, please contact the bot owner.", ephemeral: true });
	}
}