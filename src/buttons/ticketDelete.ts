import Button from "../structures/Button";
import { ButtonInteraction } from "discord.js";
import TicketSaveTranscriptsButton from "./ticketSaveTranscript";


export default class TicketDeleteButton extends Button {
	constructor() {
		super("ticketDelete");
	}

	async exec(interaction: ButtonInteraction) {
		await new TicketSaveTranscriptsButton().exec(interaction);
		await interaction.channel.delete();
	}
}