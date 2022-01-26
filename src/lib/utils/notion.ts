/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Client } from "@notionhq/client";
import { config } from "dotenv";
config();

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

const database_id = "81dd715531a34aa89063179bc427b0b6";

export async function createTranscriptEntry(transcript: { title: string, category?: string; }) {
    const properties = {
        Name: {
            title: [
                {
                    text: {
                        content: transcript.title,
                    },
                },
            ],
        },
        category: {
            select: {
                name: transcript.category,
            }
        },
    };

    if (!transcript.category) delete properties.category;

    return notion.pages.create({
        parent: {
            database_id
        },
        // @ts-ignore
        properties,
    });
}

export async function deleteTranscriptEntry(block_id) {
    const page = await notion.blocks.children.list({
        block_id,
    });

    // @ts-ignore
    if (page.results.length) return;
    return notion.blocks.delete({
        block_id,
    });
}

export async function createTranscriptNotion({ block_id, htmlString }: { block_id: string, htmlString: string; }) {
    const children = [];
    if (htmlString) {
        children.push({
            object: "block",
            type: "code",
            code: {
                text: [],
                language: "html"
            }
        });
        for (let i = 0; i < htmlString.length; i += 2000) {
            children[0].code.text.push({
                type: "text",
                text: { content: htmlString.substring(i, i + 2000) },
            });
        }
    }

    return notion.blocks.children.append({
        block_id,
        // @ts-ignore
        children,
    });
}
