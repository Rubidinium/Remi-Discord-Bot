import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, Intents, } from "discord.js";
import { readdirSync, lstatSync } from "fs";
import { resolve } from "path";
import { config } from "dotenv";
config();

class Bot extends Client {
	constructor() {
		super({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS] });

	}
}

type Command = {
	name: string,
	command: SlashCommandBuilder,
	group: string
}

async function loadCommands(root) {
	const commands: Map<string, Command> = new Map();
	const files = readdirSync(resolve(__dirname, root));
	for(const entry in files) {
		if(lstatSync(resolve(__dirname, root, entry)).isDirectory()) {
			commands.push(...await loadCommands(resolve(root, entry)));
		} else {
			commands.push({group: entry, ...await import(resolve(__dirname, root, entry))});
		}
	}

	return commands;
}

const commands = loadCommands("commands");

const client = new Bot();
client.once("ready", () => {
	console.log("ready");
	client.user?.setActivity({
		type: "COMPETING"
	});

});
client.login(process.env.TOKEN);
