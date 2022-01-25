import { ButtonInteraction, GuildChannel } from "discord.js";

const ARCHIVE_CATEGORY = "935403023159689226";

export default async function (interaction: ButtonInteraction) {
	const channel = interaction.channel as GuildChannel;
	await channel.setParent(ARCHIVE_CATEGORY);
	await channel.setName(`archive-${channel.name}`);
}