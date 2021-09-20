import { Socket } from 'net';
import { appendFileSync } from 'fs';
import { GuildChannel, Collection } from 'discord.js';
export default class Logger {
    constructor(config) {
        /*
        config {
            name: String?,
            timestamps: bool,
            exitOnError: bool,
            lineNumber: bool,
            showLoggingLevel: bool
            targets: Array<{
                value: Socket | String,
                type: string, //e.g. 'socket' 'file' 'discordChannel'
                handler?: (message) => void, // An optional method for writing the data
            }>,

        }
        */

        this.name = config.name ? config.name : 'Logger';
        this.showTimestamps = config.timestamps;
        this.lineNumber = config.lineNumber;
        this.output = config.output;
        this.exitOnError = config.exitOnError;
        this.showLoggingLevel = config.showLoggingLevel;

        this.handlers = new Collection();
        config.targets.forEach(i => {
            switch (i.type) {
                case 'discordChannel':
                    this.handlers.set('discordChannel', { execute: discordChannel, value: i.value });
                    break;
                case 'file':
                    this.handlers.set('file', { execute: file, value: i.value });
                    break;
                case 'socket':
                    this.handlers.set('socket', { execute: socket, value: i.value });
                    break;
                default:
                    this.handlers.set(i.type, { execute: i.handler, value: i.value })
            }
        });

        this.targets = config.targets.map(i => i.type)
    }

    writeRaw(message) {
        this.targets.forEach(i => {
            const handler = this.handlers.get(i);
            handler.execute(message, handler.value)
        });
    }

    info(strings, ..._) {
        let message = '';
        strings.forEach((string, i) => {
            message += string + _[i];
        });
        message = message.slice(0, -9);
        this.writeRaw(`${this.showLoggingLevel ? 'info' : ''} ${this.showTimestamps ? `[${(new Date()).toUTCString()}]` : ``} ${message}`)
    }

    warn(strings, ..._) {
        let message = '';
        strings.forEach((string, i) => {
            message += string + _[i];
        });
        message = message.slice(0, -9);
        this.writeRaw(`${this.showLoggingLevel ? 'warn' : ''} ${this.showTimestamps ? `[${(new Date()).toUTCString()}]` : ``} ${message}`)
    }

    error(strings, ..._) {
        let message = '';
        strings.forEach((string, i) => {
            message += string + _[i];
        });
        message = message.slice(0, -9);
        this.writeRaw(`${this.showLoggingLevel ? 'error' : ''} ${this.showTimestamps ? `[${(new Date()).toUTCString()}]` : ``} ${message}`)
        if (this.exitOnError) process.exit();
    }
}

export function discordChannel(message, channel) {
    channel.send(message);
}

export function file(message, path) {
    appendFileSync(path, message, { encoding: 'utf-8' })
}

export function socket(message, socket) {
    socket.write(message);
}