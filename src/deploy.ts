import dotenv from "dotenv";
dotenv.config();

import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import fs from "fs";
import { CommandType } from "types";
const { TOKEN, CLIENTID, GUILDID } = process.env;

const commands: CommandType[] = [];

const commandFiles = fs
	.readdirSync("./src/commands")
	.filter((file) => file.endsWith(".js"));



const rest = new REST({ version: "9" }).setToken(TOKEN ?? "shutup i want to drive a stake through ur heart typesccript");

(async () => {
	for (const file of commandFiles) {
		await import(`./commands/${file}`).then(({ default: command }) => {
			commands.push(command.data);
		});
	}
	try {
		console.log("Began registering slash commands");

		await rest.put(Routes.applicationGuildCommands(CLIENTID ?? "shutup i want to drive a stake through ur heart typesccript", GUILDID ?? "shutup i want to drive a stake through ur heart typesccript"), {
			body: commands,
		});

		console.log("Successfully completed registering slash commands");
	} catch (e) {
		console.error(e);
	}
})();
