import { ButtonInteraction, MessageAttachment, TextChannel } from "discord.js";
import { createTranscript } from "../../lib/transcripts";
import { createTranscriptNotion } from "../../lib/utils/notion";


export default async function (interaction: ButtonInteraction) {
	interaction.deferReply();
	const transcriptFile = await createTranscript(interaction.channel) as MessageAttachment;

	const channel = interaction.channel as TextChannel;
	const block_id = channel.name.split("-")[channel.name.split("-").length - 1];
	const options = {
		block_id,
		htmlString: transcriptFile.attachment.toString()
	};

	try {
		await createTranscriptNotion(options);
		const url = `https://transcripts.programmingsimplified.org/${block_id}`;
		interaction.editReply(`The transcript has been saved\n${url}`);
		(await interaction.client.users.fetch(channel.name.split("-")[1])).send(`An admin has saved your ticket and can be viewed here:\n${url}`);
	}
	catch (e) {
		console.error(e);
		interaction.editReply({ content: "There was an error creating the transcript. Please try again later. If this error persists, please contact the bot owner." });
	}
}