import { REST } from '@discordjs/rest';
import fs from 'fs';

import { createRequire } from 'module';
const require = createRequire(
    import.meta.url);
const { token, clientId, guildId } = require('../../config.json');
const { Routes } = require('discord-api-types');



let commands = [];

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    import (`./${file}`).then(command =>
        commands.push(command.data)
    );
}
const rest = new REST({ version: '9' }).setToken(token);

(async() => {
    try {
        console.log('Began registering slash commands');

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId), { body: commands }
        );

        console.log('Successfully completed registering slash commands');
    } catch (e) {
        console.error(e);
    }
});