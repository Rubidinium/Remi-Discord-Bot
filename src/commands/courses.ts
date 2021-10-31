import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction } from "discord.js";
import PaginationEmbed from "../embeds/PaginationEmbed";

const command = new SlashCommandBuilder()
	.setName("courses")
	.setDescription("Info about the courses");

const courses = [
	{
		name: "Web Development",
		id: "web",
		description: "Learn how to build a website",
		price: "FREE",
		duration: "4 weeks",
		image: "https://i.imgur.com/qQqxQ8l.png",
	},
	{
		name: "Game Development",
		id: "game",
		description: "Learn how to build a game",
		price: "FREE",
		duration: "4 weeks",
		image: "https://i.imgur.com/qQqxQ8l.png",
	},
	{
		name: "Discord Bot Development (JS)",
		id: "bot",
		description: "Learn how to build a discord bot",
		price: "FREE",
		duration: "8 weeks",
		image: "https://i.imgur.com/qQqxQ8l.png",
	},
	{
		name: "Artificial Intelligence",
		id: "ai",
		description: "Learn how to build a AI",
		price: "FREE",
		duration: "8 weeks",
		image: "https://i.imgur.com/qQqxQ8l.png",
	},
];

export default {
	data: command.toJSON(),
	async execute(interaction: CommandInteraction, _: Client) {
		interaction.reply(
			new PaginationEmbed(
				{
					title: courses[0].name,
					description: courses[0].description,
					fields: [
						{ name: "Duration", value: courses[0].duration, inline: true },
						{ name: "Price", value: courses[0].price, inline: true },
					],
					course: courses[0],
				},
				1
			).message
		);

		_;
	},
};

export { courses };

export type Course = {
	name: string,
	id: string,
	description: string,
	price: string,
	duration: string,
	image: string,
}