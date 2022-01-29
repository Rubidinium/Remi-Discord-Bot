import Button from "../structures/Button";
import { ButtonInteraction, Message, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { logger } from "..";


export default class TicketConfirmButton extends Button {
	constructor() {
		super("ticketConfirm");
	}

	async exec(interaction: ButtonInteraction) {
		const embed = new MessageEmbed()
			.setTitle("Are you sure you want to close this ticket?")
			.setDescription(
				"Click the green button if yes, or click the red button to cancel."
			)
			.setColor(0xA020F0)
			.setFooter({ text: `${interaction.user.tag}`, iconURL: interaction.user.avatarURL() });
		await interaction.reply({
			embeds: [embed], components: [
				new MessageActionRow()
					.addComponents(
						new MessageButton()
							.setCustomId("ticketClose")
							.setLabel("Confirm")
							.setEmoji("✅")
							.setStyle("SUCCESS"),
						new MessageButton()
							.setCustomId("ticketCancelClose")
							.setLabel("Cancel")
							.setEmoji("❌")
							.setStyle("DANGER")
					)
			]
		});

		interaction.message.components.forEach((component) => {
			(component as MessageActionRow).components.forEach((button: MessageButton) => {
				button.setDisabled();

			});
		});

		(interaction.message as Message).edit({ components: interaction.message.components as MessageActionRow[] });

		logger.ticketClose(interaction.user);
	}
}