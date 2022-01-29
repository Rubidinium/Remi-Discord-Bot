import SlashCommand from "../structures/Command";
import { CommandInteraction, MessageEmbed } from "discord.js";


export default class BannerCommand extends SlashCommand {
	constructor() {
		super("banner", "Returns a custom banner");
	}

	exec(interaction: CommandInteraction) {
		interaction.reply({
			embeds: [
				new MessageEmbed().setTitle("Example title").setDescription("Example description here")
			]
		});
	}
}