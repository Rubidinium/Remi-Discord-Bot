import SlashCommand from "../structures/Command";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";


export default class BannerCommand extends SlashCommand {
	constructor() {
		// @ts-ignore
		super(new SlashCommandBuilder()
			.setName("banner")
			.setDescription("Returns a custom banner.")
			.addStringOption(option =>
				option.setName("banner_text")
					.setDescription("The text that will appear on the banner.")
					.setRequired(true))
			.addStringOption(option =>
				option.setName("banner_type")
					.setDescription("The banner type to use.")
					.addChoice("Default", "default"))
		);
	}

	async exec(interaction: CommandInteraction) {
		interaction.reply({
			embeds: [
				new MessageEmbed().setTitle("Example title").setDescription("Example description here")
			]
		});
	}
}