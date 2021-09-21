import { Socket } from 'net';
import { appendFileSync } from 'fs';
import { GuildChannel, Collection } from 'discord.js';
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

    sill(strings, ..._) {
        if (this.maxLoggingLevel >= 4) {
            let message = '';
            strings.forEach((string, i) => {
                message += string + _[i];
            });
            message = message.slice(0, -9);
            this.writeRaw(`${this.showLoggingLevel ? 'sill' : ''} ${this.showTimestamps ? `[${(new Date()).toUTCString()}]` : ``} ${message}`)
        }
    }

    info(strings, ..._) {
        if (this.maxLoggingLevel >= 3) {
            let message = '';
            strings.forEach((string, i) => {
                message += string + _[i];
            });
            message = message.slice(0, -9);
            this.writeRaw(`${this.showLoggingLevel ? 'info' : ''} ${this.showTimestamps ? `[${(new Date()).toUTCString()}]` : ``} ${message}`)
        }
    }

    warn(strings, ..._) {
        if (this.maxLoggingLevel >= 2) {
            let message = '';
            strings.forEach((string, i) => {
                message += string + _[i];
            });
            message = message.slice(0, -9);
            this.writeRaw(`${this.showLoggingLevel ? 'warn' : ''} ${this.showTimestamps ? `[${(new Date()).toUTCString()}]` : ``} ${message}`)
        }
    }

    error(strings, ..._) {
        let message = '';
        strings.forEach((string, i) => {
            message += string + _[i];
        });
        message = message.slice(0, -9);
        this.writeRaw(`${this.showLoggingLevel ? 'error' : ''} ${this.showTimestamps ? `[${(new Date()).toUTCString()}]` : ``} ${message}`)
        if (this.exitOnError) process.exit(-1);
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