import { Client, Collection, Intents, Interaction, MessageActionRow, TextChannel, MessageButton } from "discord.js";
import { readdirSync } from "fs";
import BaseCommand from "./commands";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/rest/v9";
import { config } from "dotenv";
import hasArg from "./lib/utils/hasArg";
import { RateLimiter } from "discord.js-rate-limiter";
import { Embed } from "@discordjs/builders";
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
		const { default: commandClass } = await import(`./commands/${file}`);
		const commandInstance: BaseCommand = new commandClass();
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

	client.once("ready", async () => {
		console.log(`${client.user.tag} is ready!`);
		const channel = await client.channels.fetch("935078633427570739") as TextChannel;
		// channel.send({
		// 	embeds: [new Embed().setTitle("Ticket Creation 🎟️").setDescription("Press the green button to open a ticket!")], components: [new MessageActionRow().addComponents(new MessageButton()
		// 		.setCustomId('ticket_open')
		// 		.setLabel('Open Ticket')
		// 		.setStyle('SUCCESS')
		// 		.setEmoji('✉️'))]
		// });

		client.user?.setActivity({
			name: "with my code",
			type: "COMPETING"
		});
	});

	const rateLimiter = new RateLimiter(1, 5000);
	client.on("interactionCreate", async (interaction: Interaction) => {
		const limited = rateLimiter.take(interaction.user.id);
		//@ts-ignore
		if (limited) return interaction.reply({ content: "You've been rate limited.", ephemeral: true });

		if (interaction.isCommand()) {
			const command = commands.get(interaction.commandName);
			if (!command) return;
			await command.execute(interaction).catch(() => interaction.editReply({
				content: "An error occurred while executing this command.\nIf this keeps happening please contact the owner.",
			}));
		}

		if (interaction.isButton()) {
			if (interaction.customId == "ticket_open") {
				const channel = await interaction.guild.channels.create(`ticket-${interaction.user.username}`, {
					//@ts-ignore
					type: "text",
					parent: "935085260545339412",
				});
				//@ts-ignore
				await channel.send({content: `${interaction.user}`, components: [new MessageActionRow().addComponents(new MessageButton()
					.setCustomId(`ticket_close_${channel.id}`)
					.setLabel('Close Ticket')
					.setEmoji('🗑️')
					.setStyle('DANGER')
					)]
				});
		}};

	});

	client.login(process.env.TOKEN);

}