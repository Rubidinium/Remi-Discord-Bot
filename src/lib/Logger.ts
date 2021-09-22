import { Socket } from 'net';
import { appendFileSync } from 'fs';
import { TextChannel, Collection, MessageEmbed, ColorResolvable } from 'discord.js';

type LoggingLevel = {
    color: ColorResolvable,
    method: (string: string[], ...args: unknown[]) => void,
    name: string,
}

type Handler = {
    execute: (message: string, data: any, level: LoggingLevel | undefined) => void,
    value: any,
    type: string
}

type LoggerConfig = {
    name?: string,
    handlers: Handler[],
    maxLoggingLevel?: number,
    showTimestamps?: boolean,
    showLineNumber?: boolean,
    exitOnError?: boolean,
    showLoggingLevel?: boolean,
}
export default class Logger {
    public name: string;

    public readonly maxLoggingLevel: number;
    public readonly showTimestamps: boolean;
    public readonly showLineNumber: boolean;
    public readonly exitOnError: boolean;
    public readonly showLoggingLevel: boolean; 

    public levels: Collection<number, LoggingLevel>;
    public handlers: Collection<string, Handler>;

    public targets: string[];


    constructor(configRaw: LoggerConfig) {
        let { handlers, name = 'Logger', maxLoggingLevel = 4, showTimestamps = true, showLineNumber = false, exitOnError = false, showLoggingLevel = true} = configRaw;
        this.name = name ? name : 'Logger';
        this.maxLoggingLevel = maxLoggingLevel ? maxLoggingLevel : 3;

        this.showTimestamps = showTimestamps;
        this.showLineNumber = showLineNumber;
        this.exitOnError = exitOnError;
        this.showLoggingLevel = showLoggingLevel;

        this.levels = new Collection();
        this.levels.set(4, {
            color: 'GREEN',
            method: this.sill,
            name: 'sill',
        });
        this.levels.set(3, {
            color: 'BLUE',
            method: this.info,
            name: 'info',
        });
        this.levels.set(2, {
            color: 'YELLOW',
            method: this.warn,
            name: 'warn',
        });
        this.levels.set(1, {
            color: 'RED',
            method: this.error,
            name: 'error',
        });


        this.handlers = new Collection();
        handlers.forEach((i: Handler) => {
            switch (i.type) {
                case 'discordChannel':
                    this.handlers.set('discordChannel', { execute: this.discordChannel, value: i.value, type: i.type });
                    break;
                case 'file':
                    this.handlers.set('file', { execute: this.file, value: i.value, type: i.type });
                    break;
                case 'socket':
                    this.handlers.set('socket', { execute: this.socket, value: i.value, type: i.type });
                    break;
                default:
                    this.handlers.set(i.type, i)
            }
        });

        this.targets = handlers.map(i => i.type)
    }

    writeRaw(message: string, level: number) {
        this.targets.forEach(i => {
            const handler = this.handlers.get(i);
            handler?.execute(message, handler.value, this.levels.get(level))
        });
    }

    sill(strings: string[], ..._: any[]) {
        if (this.maxLoggingLevel >= 4) {
            let message = '';
            strings.forEach((string, i) => {
                message += string + _[i];
            });
            message = message.slice(0, -9);
            this.writeRaw(`${this.showLoggingLevel ? 'sill' : ''} ${this.showTimestamps ? `[${(new Date()).toUTCString()}]` : ``} ${message}`, 4)
        }
    }

    info(strings: string[], ..._: any[]) {
        if (this.maxLoggingLevel >= 3) {

            let message = '';
            strings.forEach((string, i) => {
                message += string + _[i];
            });
            message = message.slice(0, -9);
            this.writeRaw(`${this.showLoggingLevel ? 'info' : ''} ${this.showTimestamps ? `[${(new Date()).toUTCString()}]` : ``} ${message}`, 3)
        }
    }

    warn(strings: string[], ..._: any[]) {
        if (this.maxLoggingLevel >= 2) {
            let message = '';
            strings.forEach((string, i) => {
                message += string + _[i];
            });
            message = message.slice(0, -9);
            this.writeRaw(`${this.showLoggingLevel ? 'warn' : ''} ${this.showTimestamps ? `[${(new Date()).toUTCString()}]` : ``} ${message}`, 2)
        }
    }

    error(strings: string[], ..._: any[]) {
        let message = '';
        strings.forEach((string, i) => {
            message += string + _[i];
        });
        message = message.slice(0, -9);
        this.writeRaw(`${this.showLoggingLevel ? 'error' : ''} ${this.showTimestamps ? `[${(new Date()).toUTCString()}]` : ``} ${message}`, 1)
    }

    discordChannel(message: string, channel: any, level: LoggingLevel | undefined) {
        const embed = new MessageEmbed()
            .setAuthor("gazza")
            .setImage('https://i.ytimg.com/vi/M5JFeTtSS3c/maxresdefault.jpg')
            .setThumbnail('https://cdn.shopify.com/s/files/1/0052/6666/9639/files/be_gay_do_crime_io_ascarium_large.jpg?v=1580670163')
            .setDescription("smth happened")
            .addField(`ㅤ`, message, true)
            .setColor(level ? level.color : 'ORANGE');
        channel.send({ embeds: [embed] });
    }

    file(message: string, path: any, level: LoggingLevel | undefined) {
        appendFileSync(path, message, { encoding: 'utf-8' })
    }

    socket(message: string, socket: any, level: LoggingLevel | undefined) {
        socket.write(message);
    }
}