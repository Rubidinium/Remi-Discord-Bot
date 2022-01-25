import { GuildChannel } from "discord.js";

export default async function (channel: GuildChannel) {
	// TODO: Remove users perms to see channel | Add buttons (re-open, delete and save transcript, save transcript)
	await channel.setName(`archive-${channel.name}`);


}