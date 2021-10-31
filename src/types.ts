import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction } from "discord.js";

export interface Course {
	name: string,
	members: number,
	roleId: string,
	description: string
}

export interface Command {
	data: SlashCommandBuilder,
	execute: (interaction: CommandInteraction, parent: Client) => Promise<void>
}