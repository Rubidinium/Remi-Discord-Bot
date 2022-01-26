import { Client } from "@notionhq/client";

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
})

export async function getLastTranscriptId(category) {
    const databaseId = "81dd715531a34aa89063179bc427b0b6";
    const response = await notion.databases.query(databaseId, {
        filter: {
            "and": [
                {
                    property: "category",
                }
            ]
        }
    }
    )
}
                