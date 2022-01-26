import { ButtonInteraction, Message, MessageActionRow, MessageButton, TextChannel  } from "discord.js";

export default async function (interaction: ButtonInteraction) {
	if (interaction.message.embeds[0].footer.text != interaction.user.tag) return interaction.reply({content: "You can't interact here.", ephemeral: true});
	// TODO: Remove users perms to see channel | Add buttons (re-open, delete and save transcript, save transcript)	
	const channel = interaction.channel as TextChannel;

	channel.permissionOverwrites.edit(await interaction.client.users.fetch(channel.name.split("-")[1]), {
		VIEW_CHANNEL: false
	});

	await interaction.reply({
		content: `${interaction.user} closed the ticket!`,
		components: [
			new MessageActionRow().addComponents(
				new MessageButton()
					.setCustomId("ticketReopen")
					.setLabel("Re-Open Ticket")
					.setEmoji("🍍")
					.setStyle("SUCCESS")
				,
				new MessageButton()
					.setCustomId("ticketSaveTranscript")
					.setLabel("Save Transcript")
					.setEmoji("📝")
					.setStyle("PRIMARY")
				,
				new MessageButton()
					.setCustomId("ticketDelete")
					.setLabel("Delete Ticket")
					.setEmoji("🗑️")
					.setStyle("DANGER")
			),
		]
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