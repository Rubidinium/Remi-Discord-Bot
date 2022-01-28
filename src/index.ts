/* eslint-disable indent */
import {
	Client,
	Collection,
	Intents,
	TextChannel,
} from "discord.js";
import { readdirSync } from "fs";
import BaseCommand from "./commands";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/rest/v9";
import hasArg from "./lib/utils/hasArg";
import { RateLimiter } from "discord.js-rate-limiter";
import { InteractionKind } from "./lib/types/interactionKind";
import ticketType from "./interactions/selects/ticketType";
import ticketOpen, { resetInactivityTimer } from "./interactions/buttons/ticketOpen";
import ticketClose from "./interactions/buttons/ticketClose";
import ticketReopen from "./interactions/buttons/ticketReopen";
import ticketDelete from "./interactions/buttons/ticketDelete";
import ticketSaveTranscript from "./interactions/buttons/ticketSaveTranscript";
import ticketConfirm from "./interactions/buttons/ticketConfirm";
import ticketCancelClose from "./interactions/buttons/ticketCancelClose";
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
		.filter((file) => file.split(".command").length > 1);

(async () => {
	for (const file of commandFiles) {
		const { default: CommandClass } = await import(`./commands/${file}`);
		const commandInstance: BaseCommand = new CommandClass();
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore THIS IS A VALID USE OF TS-IGNORE
		if (["MESSAGE", "USER"].includes(commandInstance.metadata.type as string)) delete commandInstance.metadata.description;
		commands.set(commandInstance.metadata.name, commandInstance);
	}
})().then(main);

export const timers = new Collection<string, NodeJS.Timeout>();
export const rateLimiter = new RateLimiter(2, 1000);
// 24 hours
export const timeoutLimit = 1000 * 60 * 60 * 24;
// export const timeoutLimit = 5000;

async function main() {
	if (hasArg("register", "r")) {
		console.log("registering");

		const cmdDatas = commands.map(cmd => cmd.metadata);
		const cmdNames = cmdDatas.map(cmdData => cmdData.name);

		console.log(
			cmdNames.map(cmdName => `'${cmdName}'`).join(", ")
		);

		try {
			const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);
			await rest.put(Routes.applicationGuildCommands("883540250759163975", "924860504302821377"), { body: cmdDatas });
		} catch (error) {
			console.error("Error registering commands:", error);
			return;
		}

		console.log("Successfully registered commands!");
		process.exit(0);
	}

	const client = new Bot();



	client.once("ready", async () => {
		console.log(`${client.user.tag} is ready!`);

		client.user?.setActivity({
			name: "/help",
			type: "LISTENING"
		});
	});

	client.on("messageCreate", (message) => {
		if (message.author.bot) return;
		if (timers.has(message.channel.id)) {
			resetInactivityTimer(message.channel as TextChannel, client);
		}
	});

	client.on("interactionCreate", async (interaction: InteractionKind) => {
		try {
			const limited = rateLimiter.take(interaction.user.id);

			if (limited) return await interaction.reply({ content: "You've been rate limited.", ephemeral: true });

			if (interaction.isCommand()) {
				const command = commands.get(interaction.commandName);
				if (!command) return;
				await command.execute(interaction);
			}

			if (interaction.isButton()) {
				switch (interaction.customId) {
					case "ticketOpen":
						await ticketOpen(interaction);
						break;
					case "ticketReopen":
						await ticketReopen(interaction);
						break;
					case "ticketClose":
						await ticketConfirm(interaction);
						break;
					case "ticketDelete":
						await ticketDelete(interaction);
						break;
					case "ticketSaveTranscript":
						await ticketSaveTranscript(interaction);
						break;
					case "confirmClose":
						await ticketClose(interaction);
						break;
					case "cancelClose":
						await ticketCancelClose(interaction);
						break;
				}
			}
			if (interaction.isSelectMenu()) {
				if (interaction.customId == "ticketType") ticketType(interaction);
			}
		}
		catch (error) {
			const msg = { content: `There was an error with this interaction. Please try again later. If the issue persists, please contact the bot owner\n${error}`, ephemeral: true };
			try { await interaction.reply(msg); }
			catch (e) { await interaction.editReply(msg); }
		}
	});

	client.login(process.env.TOKEN);
}