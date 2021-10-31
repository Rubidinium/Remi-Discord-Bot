import dotenv from "dotenv";
dotenv.config();

import {
	Client,
	ClientOptions,
	Collection,
	Intents,
} from "discord.js";

import { courses } from "./commands/courses";

import { Server } from "./server";
import fs from "fs";
import { Command } from "types";
import getRoles from "./util/getRoles";

class Gary extends Client {
	public courses = courses;
	constructor(options: ClientOptions) {
		super(options);

	}
}

const client = new Gary({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
	],
});
const commands = new Collection<string, Command>();

const commandFiles = fs
	.readdirSync("./src/commands")
	.filter((file) => file.endsWith(".ts"));

for (const file of commandFiles) {
	import(`./commands/${file}`).then(({ default: command }) => {
		commands.set(command.data.name, command);
	});
}

client.once("ready", async () => {
	console.log(`${client.user?.username} is ready.`);
	client.user?.setActivity("/help", { type: "LISTENING" });


	const server = new Server(client, {
		port: 8080
	});
	
	server.expressConfig();
});

client.on("interactionCreate", async (interaction) => {
	if (interaction.isButton()) {
		switch (interaction.customId) {
		case "register":
		case "age":
			break;

		case "back":
		case "forward":
		case "accept":
		case "reject":
			import("./interactions/courses").then((courses) => {
				courses.handle(interaction, client);
			});
			break;
		}

		if (interaction.customId.startsWith("accept_")) {

			const user = await interaction.guild?.members.fetch(interaction.customId.split("_")[1]);
			const roles = interaction.customId.split("_")[2].split(",");
			const studentRoles = await getRoles(client);
			roles.forEach(r => {
				const role = studentRoles.get(r);
				if (role) user?.roles.add(role);
			});
			interaction.reply({ content: "k", ephemeral: true });
		}
	}

	if (interaction.isCommand()) {
		const command = commands.get(interaction.commandName);
		try {
			await command?.execute(interaction, client);
		} catch (e) {
			console.error(e);
			await interaction.reply({
				content:
					"An error occurred while executing this command.\nIf this keeps happening please contact the owner.",
				ephemeral: true,
			});
		}
	}
});
client.login(process.env.TOKEN);
