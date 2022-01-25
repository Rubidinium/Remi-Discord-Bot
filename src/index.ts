/* eslint-disable indent */
import {
	Client,
	Collection,
	GuildChannel,
	Intents,
	Message,
} from "discord.js";
import { readdirSync } from "fs";
import BaseCommand from "./commands";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/rest/v9";
import { config } from "dotenv";
import hasArg from "./lib/utils/hasArg";
import { RateLimiter } from "discord.js-rate-limiter";
import { InteractionKind } from "./lib/types/interactionKind";
import ticketType from "./interactions/selects/ticketType";
import ticketOpen from "./interactions/buttons/ticketOpen";
import ticketClose from "./interactions/buttons/ticketClose";
import ticketReopen from "./interactions/buttons/ticketReopen";
import ticketDelete from "./interactions/buttons/ticketDelete";
import ticketSaveTranscript from "./interactions/buttons/ticketSaveTranscript";
import ticketConfirm from "./interactions/buttons/ticketConfirm";
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

	const timers = new Collection<string, NodeJS.Timeout>();

	const rateLimiter = new RateLimiter(1, 1000);

	// 24 hours
	const timeoutLimit = 1000 * 60 * 60 * 24;

	client.once("ready", async () => {
		console.log(`${client.user.tag} is ready!`);

		client.user?.setActivity({
			name: "/help",
			type: "LISTENING"
		});
	});

	client.on("messageCreate", (message) => {
		if (timers.has(message.channel.id)) {
			clearTimeout(timers.get(message.channel.id));

			timers.set(message.channel.id, setTimeout(async () => {
				// await ticketClose(message.channel as GuildChannel);
			}, timeoutLimit));

		}
	});

	client.on("interactionCreate", async (interaction: InteractionKind) => {
		const limited = rateLimiter.take(interaction.user.id);

		if (limited) return interaction.reply({ content: "You've been rate limited.", ephemeral: true });

		if (interaction.isCommand()) {
			const command = commands.get(interaction.commandName);
			if (!command) return;
			await command.execute(interaction).catch(() => interaction.editReply({
				content: "An error occurred while executing this command.\nIf this keeps happening please contact the owner.",
			}));
		}

		if (interaction.isButton()) {
			switch (interaction.customId) {
				case "ticketOpen":
					ticketOpen(interaction);
					break;
				case "ticketReopen":
					ticketReopen(interaction);
					break;
				case "ticketClose":
					ticketConfirm(interaction);
					break;
				case "ticketDelete":
					ticketDelete(interaction);
					break;
				case "ticketSaveTranscript":
					ticketSaveTranscript(interaction);
					break;
				case "confirmClose":
					ticketClose(interaction);
					break;
				case "cancelClose":
					(interaction.message as Message).delete();
					break;
			}
		}
		if (interaction.isSelectMenu()) {
			if (interaction.customId == "ticketType") ticketType(interaction);
		}
	});

	client.login(process.env.TOKEN);
}
