import { Client } from "@notionhq/client";
import { config } from "dotenv";
config();

const notion = new Client({
	auth: process.env.NOTION_TOKEN,
});

export async function getLastTranscriptId(category) {
	const database_id = "81dd715531a34aa89063179bc427b0b6";
	//@ts-ignore
	const response = await notion.databases.query({
		database_id,
		filter: {
			"and": [
				{
					property: "category",
					select: {
						equals: category
					}
				}
			]
		},

	});
	console.log(response);
}

