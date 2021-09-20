import { SlashCommandBuilder } from "@discordjs/builders";
import PaginationEmbed from "../embeds/PaginationEmbed.js";

const command = new SlashCommandBuilder()
    .setName("courses")
    .setDescription("Info about the courses");

export default {
    data: command.toJSON(),
    async execute(interaction, parent) {
        interaction.reply(new PaginationEmbed({
            title: 'test',
            description: 'ksdjflksdf',
            fields: [
                { name: 'Test field', value: 'hahahhewhawhe' }
            ]
        }, 5))
    },
};

/*
this.embed = new MessageEmbed()
            .setColor('RANDOM')
            .setTitle(page.title)
            .setAuthor('Gary')
            .setDescription(page.description)
            .addFields(page.fields)
            .setFooter(`Page 1/${pageCount}`)

            */