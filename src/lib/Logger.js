import { Socket } from 'net';
import { appendFileSync } from 'fs';
import { GuildChannel, Collection, MessageEmbed } from 'discord.js';
import moment from 'moment';

export default class Logger {
    constructor(config) {
        /*
        config {
            name: String?,
            maxLoggingLevel: number,
            showTimestamps: bool,
            exitOnError: bool,
            showLineNumber: bool,
            showLoggerLevel: bool
            targets: Array<{
                value: Socket | String,
                type: string, //e.g. 'socket' 'file' 'discordChannel'
                handler?: (message) => void, // An optional method for writing the data
            }>,

        }
        */

        this.name = config.name ? config.name : 'Logger';
        this.maxLoggingLevel = config.maxLoggingLevel ? config.maxLoggingLevel : 3

        this.showTimestamps = config.showTimestamps;
        this.lineNumber = config.showLineNumber;
        this.output = config.output;
        this.exitOnError = config.exitOnError;
        this.showLoggingLevel = config.showLoggerLevel;

        this.levels = new Collection();

        this.levels.set(4, {
            color: 'GREEN',
            method: this.sill,
            name: 'sill',
        })
        this.levels.set(3, {
            color: 'BLUE',
            method: this.info,
            name: 'info',
        })
        this.levels.set(2, {
            color: 'YELLOW',
            method: this.warn,
            name: 'warn',
        })
        this.levels.set(1, {
            color: 'RED',
            method: this.error,
            name: 'error',
        })


        this.handlers = new Collection();
        config.targets.forEach(i => {
            switch (i.type) {
                case 'discordChannel':
                    this.handlers.set('discordChannel', { execute: this.discordChannel, value: i.value });
                    break;
                case 'file':
                    this.handlers.set('file', { execute: this.file, value: i.value });
                    break;
                case 'socket':
                    this.handlers.set('socket', { execute: this.socket, value: i.value });
                    break;
                default:
                    this.handlers.set(i.type, { execute: i.handler, value: i.value })
            }
        });

        this.targets = config.targets.map(i => i.type)
    }

    writeRaw(message, level) {
        this.targets.forEach(i => {
            const handler = this.handlers.get(i);
            handler.execute(message, handler.value, this.levels.get(level))
        });
    }

    sill(strings, ..._) {
        if (this.maxLoggingLevel >= 4) {
            let message = '';
            strings.forEach((string, i) => {
                message += string + _[i];
            });
            message = message.slice(0, -9);
            this.writeRaw(`${this.showLoggingLevel ? 'sill' : ''} ${this.showTimestamps ? `[${(new Date()).toUTCString()}]` : ``} ${message}`, 4)
        }
    }

    info(strings, ..._) {
        if (this.maxLoggingLevel >= 3) {

            let message = '';
            strings.forEach((string, i) => {
                message += string + _[i];
            });
            message = message.slice(0, -9);
            this.writeRaw(`${this.showLoggingLevel ? 'info' : ''} ${this.showTimestamps ? `[${(new Date()).toUTCString()}]` : ``} ${message}`, 3)
        }
    }

    warn(strings, ..._) {
        if (this.maxLoggingLevel >= 2) {
            let message = '';
            strings.forEach((string, i) => {
                message += string + _[i];
            });
            message = message.slice(0, -9);
            this.writeRaw(`${this.showLoggingLevel ? 'warn' : ''} ${this.showTimestamps ? `[${(new Date()).toUTCString()}]` : ``} ${message}`, 2)
        }
    }

    error(strings, ..._) {
        let message = '';
        strings.forEach((string, i) => {
            message += string + _[i];
        });
        message = message.slice(0, -9);
        this.writeRaw(`${this.showLoggingLevel ? 'error' : ''} ${this.showTimestamps ? `[${(new Date()).toUTCString()}]` : ``} ${message}`, 1)
    }

    discordChannel(message, channel, level) {


        const embed = new MessageEmbed()
            .setAuthor("gazza")
            .setImage('https://i.ytimg.com/vi/M5JFeTtSS3c/maxresdefault.jpg')
            .setThumbnail('https://cdn.shopify.com/s/files/1/0052/6666/9639/files/be_gay_do_crime_io_ascarium_large.jpg?v=1580670163')
            .setDescription("smth happened")
            .addField(`ㅤ`, message, true)
            .setColor(level.color);
        channel.send({ embeds: [embed] });
    }

    file(message, path, level) {
        appendFileSync(path, message, { encoding: 'utf-8' })
    }

    socket(message, socket, level) {
        socket.write(message);
    }
}