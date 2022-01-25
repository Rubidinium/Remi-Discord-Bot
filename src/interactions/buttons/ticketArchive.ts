import { GuildChannel } from "discord.js";

const ARCHIVE_CATEGORY = "935403023159689226";

export default async function (channel: GuildChannel) {
	await channel.setParent(ARCHIVE_CATEGORY);
	await channel.setName(`archive-${channel.name}`);


}