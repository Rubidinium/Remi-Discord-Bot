import { ButtonInteraction, Message } from "discord.js";

export default async function (interaction: ButtonInteraction) {
	if (interaction.message.embeds[0].footer.text != interaction.user.tag) return interaction.reply({ content: "You can't interact here.", ephemeral: true });

	await (interaction.message as Message).delete();
	const messageHistory = await interaction.channel.messages.fetch();

	const messages = messageHistory.filter(msg => {
		let passes = false;
		msg.components.forEach((row) => {
			row?.components?.forEach(component => {
				if (component?.customId == "ticketClose") {
					passes = true;
				}
			});
		});
		return passes;
	}).values();

	[...messages].forEach(msg => {
		msg.components.forEach((row) => {
			row.components.forEach(component => {
				component.setDisabled(false);
			});
		});
		msg.edit({ components: msg.components });
		}
	);

}