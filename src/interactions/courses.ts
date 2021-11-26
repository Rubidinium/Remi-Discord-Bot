import { ButtonInteraction, Client, Collection, Interaction } from "discord.js";
import { courses } from "../commands/courses";
import PaginationEmbed from "../embeds/PaginationEmbed";

const buttons = new Collection<string, (interaction: ButtonInteraction) => void>();

buttons.set("back", (interaction: ButtonInteraction) => {
	if (interaction.message.embeds[0].footer?.text) {
		const currentPage =
			parseInt(interaction.message.embeds[0].footer.text.slice(5).split("/")[0]) -
			1;

		interaction.update(
			new PaginationEmbed(
				{
					title: courses[currentPage - 1].name,
					description: courses[currentPage - 1].description,
					fields: [
						{
							name: "Duration",
							value: courses[currentPage - 1].duration,
							inline: true,
						},
						{
							name: "Price",
							value: courses[currentPage - 1].price,
							inline: true,
						},
					],
					course: courses[currentPage - 1],
				},
				currentPage
			).message
		);
	}
});

buttons.set("forward", (interaction: ButtonInteraction) => {
	if (interaction.message.embeds[0].footer?.text) {
		const currentPage =
			parseInt(interaction.message.embeds[0].footer.text.slice(5).split("/")[0]) -
			1;
		interaction.update(
			new PaginationEmbed(
				{
					title: courses[currentPage + 1].name,
					description: courses[currentPage + 1].description,
					fields: [
						{
							name: "Duration",
							value: courses[currentPage + 1].duration,
							inline: true,
						},
						{
							name: "Price",
							value: courses[currentPage + 1].price,
							inline: true,
						},
					],
					course: courses[currentPage + 1],
				},
				currentPage + 2
			).message
		);
	}

});

export const handle = (interaction: ButtonInteraction, client: Client) => {
	const a = buttons.get(interaction.customId);
	if (a) {
		a(interaction);
	}
};

export { buttons };
