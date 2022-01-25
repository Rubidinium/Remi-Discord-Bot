import { ButtonInteraction, Message } from "discord.js";

export default async function (interaction: ButtonInteraction) {
	await (interaction.message as Message).delete();
	const messageHistory = await interaction.channel.messages.fetch();

	const firstMessage: Message = messageHistory.filter(msg => {
		let passes = false;
		msg.components.forEach((row) => {
			row?.components?.forEach(component => {
				console.log(component);
				if (component?.customId == "ticketClose") {
					passes = true;
				}
			});
		});
		return passes;
	}).first();

	firstMessage.components.forEach((row) => {
		row.components.forEach(component => {
			component.setDisabled(false);
		});
	});

	firstMessage.edit({ components: firstMessage.components });
}