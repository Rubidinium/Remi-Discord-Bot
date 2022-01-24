import { Client, Collection, Intents, Interaction, MessageActionRow, TextChannel, MessageButton, MessageSelectMenu } from "discord.js";
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
		const { default: CommandClass } = await import(`./commands/${file}`);
		const commandInstance: BaseCommand = new CommandClass();
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
		// 		.setCustomId('ticketOpen')
		// 		.setLabel('Open Ticket')
		// 		.setStyle('SUCCESS')
		// 		.setEmoji('✉️'))]
		// });

		client.user?.setActivity({
			name: "with my code",
			type: "COMPETING"
		});
	});

	const rateLimiter = new RateLimiter(1, 3000);
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
			switch (interaction.customId) {
				case "ticketOpen":
					
					const channel = await interaction.guild.channels.create(`ticket-${interaction.user.username}`, {
						//@ts-ignore
						type: "text",
						parent: "935085260545339412",
						permissionOverwrites: [
							{
								id: interaction.user.id,
								allow: ["VIEW_CHANNEL"],
							}
						]
					});
					//@ts-ignore
					await channel.send({
						content: `${interaction.user}`, components: [new MessageActionRow().addComponents(new MessageButton()
							.setCustomId(`ticketClose`)
							.setLabel('Close Ticket')
							.setEmoji('🗑️')
							.setStyle('DANGER')
						)]
					});
					//@ts-ignore
					channel.send({embeds: [new Embed().setTitle(`Ticket-${interaction.user.username}`).setDescription("Please choose the course that corresponds with your inquiry (choose other if this doesn't apply to you).").setColor(0xA020F0)], components: [new MessageActionRow().addComponents(new MessageSelectMenu()
						.setCustomId('ticketType')
						.setPlaceholder('Select a ticket type')
						.setOptions([
								{label: 'Python101', value: 'python101'}, 
								{label: 'Javascript101', value: 'javascript101'},
								{label: 'Java101', value: 'java101'},
								{label: 'WebDev', value: 'webdev'},
								{label: 'DiscordJS', value: 'discordjs'},
								{label: 'SQL', value: 'sql'},
								{label: 'Other', value: 'other'}
							])
						)],
						ephemeral: true
					})
					interaction.reply({ content: `Ticket created!`, ephemeral: true });
					return;
				case "ticketClose":
					await interaction.channel.delete();
					return;
			}
		}

		if (interaction.isSelectMenu()) {
			switch (interaction.customId) {
				case "ticketType":
					//@ts-ignore
					interaction.channel.edit({name: `ticket-${interaction.user.username}-${interaction.values[0]}`});
					//@ts-ignore
					interaction.message.delete();
					switch (interaction.values[0]) {
						case "python101":
							await interaction.channel.send("<@&935091117966385173>");
							break;
						case "javascript101":
							await interaction.channel.send("<@&935091142884724786>");
							break;
						case "java101":
							await interaction.channel.send("<@&935091172672679976>");
							break;
						case "webdev":
							await interaction.channel.send("<@&935091067437584384>");
							break;
						case "discordjs":
							await interaction.channel.send("<@&935091084218998814>");
							break;
						case "sql":
							await interaction.channel.send("<@&935091203198844950>");
							break;
						case "other":
							break;
					}
					interaction.channel.send({embeds: [new Embed().setTitle(`Ticket-${interaction.user.username}`).setDescription("Thank you. Now, please describe your issue in detail, making sure to provide all code/errors necessary.").setColor(0xA020F0)]});

					return;
			}
		}

	});

	client.login(process.env.TOKEN);

}