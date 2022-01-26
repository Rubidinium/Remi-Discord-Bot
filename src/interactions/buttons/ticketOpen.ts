import { ButtonInteraction, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } from "discord.js";

export default async function (interaction: ButtonInteraction) {
	const channel = await interaction.guild.channels.create(`ticket-${interaction.user.id}`, {
		type: "GUILD_TEXT",
		parent: "935085260545339412",
	});
	channel.permissionOverwrites.edit(interaction.user.id, {
		VIEW_CHANNEL: true,
	});

	await channel.send({
		content: `${interaction.user}`, components: [new MessageActionRow().addComponents(new MessageButton()
			.setCustomId("ticketClose")
			.setLabel("Close Ticket")
			.setEmoji("🗑️")
			.setStyle("DANGER")
		)]
	});
	
	const embed = new MessageEmbed()
		.setTitle("Select a ticket type")
		.setDescription(
			"Please choose the course that corresponds with your inquiry (choose other if this doesn't apply to you)."
		)
		.setColor(0xA020F0);

	const select = new MessageSelectMenu()
		.setCustomId("ticketType")
		.setPlaceholder("Select a ticket type")
		.setOptions([
			{ label: "Python101", value: "python101" },
			{ label: "Javascript101", value: "javascript101" },
			{ label: "Java101", value: "java101" },
			{ label: "WebDev", value: "webdev" },
			{ label: "DiscordJS", value: "discordjs" },
			{ label: "SQL", value: "sql" },
			{ label: "Other", value: "other" }
		]);

	channel.send({
		embeds: [embed], components: [new MessageActionRow().addComponents(select)],
	});
	interaction.reply({ content: `${interaction.user} Ticket created! <#${channel.id}>`, ephemeral: true });
}