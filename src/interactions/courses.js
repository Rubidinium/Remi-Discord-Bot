import { Collection } from "discord.js";
import { courses } from "../commands/courses.js";
import PaginationEmbed from "../embeds/PaginationEmbed.js";

const buttons = new Collection();

buttons.set("back", (interaction) => {
	const currentPage = interaction.message.embeds[0].footer.text.slice(5).split('/')[0];

	interaction.update(
		new PaginationEmbed({
			title: courses[currentPage - 1].name,
			description: courses[currentPage - 1].description,
			fields: [
				{ name: "Duration", value: courses[currentPage - 1].duration },
				{ name: "Price", value: courses[currentPage - 1].price, inline: true },
			],
		})
	);
});

buttons.set("forward", (interaction) => {
	const currentPage = interaction.message.embeds[0].footer.text.slice(5).split('/')[0];
	interaction.update(
		new PaginationEmbed({
			title: courses[currentPage].name,
			description: courses[currentPage].description,
			fields: [
				{
					name: "Duration",
					value: courses[currentPage].duration,
					inline: true,
				},
				{ name: "Price", value: courses[currentPage].price, inline: true },
			],
		})
	);
});

export const handle = (interaction, client) => {
	buttons.get(interaction.customId)(interaction);
};

export { buttons };
