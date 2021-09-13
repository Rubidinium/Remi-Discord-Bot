import { SlashCommandBuilder } from '@discordjs/builders';
const command = new SlashCommandBuilder()
    .setName('group')
    .setDescription('Places you in a group');

export default {
    data: command.toJSON(),
    async execute(interaction) {
        interaction;
    }
};