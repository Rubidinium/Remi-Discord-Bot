import { CategoryChannel, GuildChannel, StageChannel, TextChannel, ThreadChannel, VoiceChannel } from "discord.js";

export type ChannelKind =
	| TextChannel
	| StageChannel
	| VoiceChannel
	| CategoryChannel
	| ThreadChannel
	| GuildChannel