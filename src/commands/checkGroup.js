import { SlashCommandBuilder } from '@discordjs/builders';
import csvParser from 'csv-parser';
import fs from 'fs';

const command = new SlashCommandBuilder()
    .setName('checkgroup')
    .setDescription('Checks what group you\'re in');

export default {
    data: command.toJSON(),
    async execute(interaction) {
        let members = [];
        fs.createReadStream('./src/db/groups.csv')
            .pipe(csvParser())
            .on('data', data => members.push(data))
            .on('end', () => {
                let { group } = members.find(i => i.id == interaction.user.id);
                interaction.reply(`You are in group ${group}`);
            });
    }
};