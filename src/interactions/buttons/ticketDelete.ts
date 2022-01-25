import { ButtonInteraction } from "discord.js";

export default function (interaction: ButtonInteraction) {
	interaction.channel.delete();
}