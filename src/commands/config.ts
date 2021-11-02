import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction } from "discord.js";
import editJsonFile from "edit-json-file";

const config = editJsonFile("../../config.json", {autosave: true});

const command = new SlashCommandBuilder()
	.setName("config")
	.setDescription("Gary Configuration")
	.addStringOption(s => s
		.setName("path")
		.setDescription("the JSON path to configure")
	)
	.addStringOption(s => s
		.setName("value")
		.setDescription("the value to set"));

export default {
	data: command.toJSON(),
	async execute(interaction: CommandInteraction, _: Client) {
		const namespace = interaction.options.getString("path") ?? "";
		const value = interaction.options.getString("value") ?? "";

		// basic prototype pollution prevention
		if(namespace.includes("__proto__")) return interaction.reply({content: "sure", ephemeral: true});
		
		try {
			config.set(namespace, value);
			interaction.reply(`successfully set ${namespace} to ${value}`);
		} catch {
			interaction.reply("The namespace or flag do not exist.");
		}

		// eslint bullshit
		_;
	},
};