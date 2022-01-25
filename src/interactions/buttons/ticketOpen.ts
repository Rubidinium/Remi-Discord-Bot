import { Embed } from "@discordjs/builders";
import { ButtonInteraction, MessageActionRow, MessageButton, MessageSelectMenu } from "discord.js";

export default async function ticketOpen(interaction: ButtonInteraction) {
	const channel = await interaction.guild.channels.create(`ticket-${interaction.user.username}`, {
		type: "GUILD_TEXT",
		parent: "935085260545339412",
		permissionOverwrites: [
			{
				id: interaction.user.id,
				allow: ["VIEW_CHANNEL"],
			}
		]
	});

	await channel.send({
		content: `${interaction.user}`, components: [new MessageActionRow().addComponents(new MessageButton()
			.setCustomId("ticketClose")
			.setLabel("Close Ticket")
			.setEmoji("🗑️")
			.setStyle("DANGER")
		)]
	});
	const embed = new Embed()
		.setTitle(`Ticket-${interaction.user.username}`)
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
		embeds: [embed], components: [new MessageActionRow().addComponents(
			select
		)],
		// mf if its ephemeral who will see it you wombat
		// ephemeral: true
	});
	interaction.reply({ content: "Ticket created!", ephemeral: true });
}