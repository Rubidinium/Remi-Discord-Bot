import dotenv from "dotenv";
dotenv.config();

import {
	Client,
	ClientOptions,
	Collection,
	CommandInteraction,
	Intents,
} from "discord.js";

import { courses } from "./commands/courses";

const { MONGO } = process.env
const { connect, connection, Model } = require("mongoose");
import { Server } from './server'
import fs from "fs";

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
type Command = {
	data: Object,
	execute: (interaction: CommandInteraction, parent: Client) => Promise<void>;
}
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


	new Server.Server(client, {
		port: 8080
	}).expressConfig({
		port: 8080
	})
	// What the fuck is this?

	// const registerMessage = await client.channels.cache
	// 	.get("884159007139459083")
	// 	.messages.fetch("889207228479963147");
	// const row = new MessageActionRow().addComponents(
	// 	new MessageSelectMenu()
	// 		.setCustomId("register")
	// 		.setPlaceholder("Select the courses you want to register for")
	// 		.setMinValues(1)
	// 		.setMaxValues(courses.length)
	// 		.addOptions(
	// 			courses.map((course) => {
	// 				return {
	// 					label: course.name,
	// 					description: course.description,
	// 					value: course.id,
	// 				};
	// 			})
	// 		)
	// );

	// registerMessage.edit({
	// 	content:
	// 		"To register for one of our courses select from options in the dropdown menu",
	// 	components: [row],
	// });


});

client.on("interactionCreate", async (interaction) => {
	if (interaction.isButton()) {
		const user = interaction.user;
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

		if(interaction.customId.startsWith('accept_')) {

			let user  = await interaction.guild?.members.fetch(interaction.customId.split('_')[1])
			let roles = interaction.customId.split('_')[2].split(',')
			roles.forEach(r => {
				let role = interaction.guild?.roles.cache.find(i => i.name == r)
				console.log(role)
				if(role) user?.roles.add(role)
			})
			interaction.reply({content: 'k', ephemeral: true})
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
