import { Embed } from "@discordjs/builders";
import { GuildChannel, Message } from "discord.js";
import { getLastTranscriptId } from "../../lib/utils/notion";

export default async function ticketType(interaction) {
	// TODO: Database implementation for ticket counter (Temporarily at 0)
	
	const newTicketName = `${interaction.values[0]}-${interaction.user.id}-${parseInt(await getLastTranscriptId(interaction.values[0])) + 1}`;
	await (interaction.channel as GuildChannel).setName(newTicketName);

	(interaction.message as Message).delete();

	switch (interaction.values[0]) {
	case "python101":
		await interaction.channel.send("<@&935091117966385173>");
		break;
	case "javascript101":
		await interaction.channel.send("<@&935091142884724786>");
		break;
	case "java101":
		await interaction.channel.send("<@&935091172672679976>");
		break;
	case "webdev":
		await interaction.channel.send("<@&935091067437584384>");
		break;
	case "discordjs":
		await interaction.channel.send("<@&935091084218998814>");
		break;
	case "sql":
		await interaction.channel.send("<@&935091203198844950>");
		break;
	case "other":
		break;
	}
	interaction.channel.permissionOverwrites.edit(interaction.user.id, {
		SEND_MESSAGES: true,
	});

	interaction.channel.send({ embeds: [new Embed().setTitle(newTicketName).setDescription("Thank you. Now, please describe your issue in detail, making sure to provide all code/errors necessary.").setColor(0xA020F0)] });
		
}