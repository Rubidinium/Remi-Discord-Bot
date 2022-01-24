import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, Collection, Intents, } from "discord.js";
import { readdirSync, lstatSync } from "fs";
import { resolve } from "path";
import { config } from "dotenv";
import { BaseCommand } from "./commands";
config();

class Bot extends Client {
	constructor() {
		super({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS] });

	}
}

const commands = new Collection<string, BaseCommand>();

const commandFiles =
	readdirSync("./src/commands")
		.filter((file) => file.endsWith(".ts"));

for (const file of commandFiles) {
	import(`./commands/${file}`).then(({ default: command }) => {
		commands.set(command.metadata.name, command);
	});
}


const client = new Bot();
client.once("ready", () => {
	console.log("ready");
	client.user?.setActivity({
		type: "COMPETING"
	});

});
client.login(process.env.TOKEN);
