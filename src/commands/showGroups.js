import { SlashCommandBuilder } from '@discordjs/builders';
const command = new SlashCommandBuilder()
    .setName('showgroups')
    .setDescription('Shows the members of the groups');

export default {
    data: command.toJSON(),
    async execute(interaction) {
        interaction;
    }
};