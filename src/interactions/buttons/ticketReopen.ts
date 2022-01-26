import { ButtonInteraction, Message, MessageActionRow, MessageButton, TextChannel } from "discord.js";

export default async function (interaction: ButtonInteraction) {
	const channel = interaction.channel as TextChannel;

	channel.permissionOverwrites.edit(await interaction.client.users.fetch(channel.name.split("-")[1]), {
		VIEW_CHANNEL: true
	});

	interaction.reply({
		content: `<@${channel.name.split("-")[1]}> The ticket has been re-opened and is now available to you again.`,
		components: [new MessageActionRow().addComponents(new MessageButton()
			.setCustomId("ticketClose")
			.setLabel("Close Ticket")
			.setEmoji("👽")
			.setStyle("DANGER")
		)]
	});

	interaction.message.components.forEach((component) => {
		(component as MessageActionRow).components.forEach((button: MessageButton) => {
			button.setDisabled();
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			(interaction.message as Message).edit({ components: interaction.message.components });
		});
	});
}