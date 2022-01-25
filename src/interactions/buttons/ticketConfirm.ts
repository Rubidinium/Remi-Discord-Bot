import { ButtonInteraction, Message, MessageActionRow, MessageButton, MessageEmbed, TextChannel } from "discord.js";

export default async function (interaction: ButtonInteraction) {
    
	const embed = new MessageEmbed()
		.setTitle(`Are you sure you want to close this ticket?`)
		.setDescription(
			"Click the green button if yes, or click the red button to cancel."
		)
		.setColor(0xA020F0);
	await interaction.reply({embeds: [embed], components: [new MessageActionRow().addComponents(new MessageButton().setCustomId("confirmClose").setLabel("Confirm").setEmoji("✅").setStyle('PRIMARY'), new MessageButton().setCustomId("cancelClose").setLabel("Cancel").setEmoji("❌").setStyle('DANGER'))]});


	interaction.message.components.forEach((component) => {
		(component as MessageActionRow).components.forEach((button: MessageButton) => {
			button.setDisabled();
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			(interaction.message as Message).edit({ components: interaction.message.components });
		});
	});
}