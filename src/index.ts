import { Client, Collection, Intents, } from "discord.js";
import { readdirSync } from "fs";
import { BaseCommand } from "./commands";
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/rest/v9';
import { config } from "dotenv";
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

if (process.argv[2] == "--register") {
	(() => {
		let cmdDatas = commands.map(cmd => cmd.metadata);
		let cmdNames = cmdDatas.map(cmdData => cmdData.name);

		console.log(
			cmdNames.map(cmdName => `'${cmdName}'`).join(', ')
		);

		try {
			let rest = new REST({ version: '9' }).setToken(Config.client.token);
			await rest.put(Routes.applicationCommands(Config.client.id), { body: [] });
			await rest.put(Routes.applicationGuildCommands(Config.client.id, '933233631390994492'), { body: cmdDatas });
		} catch (error) {
			console.error("Error registering commands:", error);
			return;
		}

		console.log("Successfully registered commands!");
	});
}

const client = new Bot();

client.once("ready", () => {
	console.log("ready");
	client.user?.setActivity({
		type: "COMPETING"
	});

});

process.title = "bot";
client.login(process.env.TOKEN).then(() => console.log("logged in"));
