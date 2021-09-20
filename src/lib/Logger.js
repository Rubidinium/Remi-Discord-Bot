import { Socket } from 'net';
import { appendFileSync } from 'fs';
import { GuildChannel } from 'discord.js';
export default class Logger {
    constructor(config) {
        /*
        config {
            name: String?,
            timestamps: bool,
            exitOnError: bool,
            lineNumber: bool,
            showLoggingLevel: bool
            output: Socket | String | Channel,
        }
        */

        this.name = config.name ? config.name : 'Logger';
        this.showTimestamps = config.timestamps;
        this.lineNumber = config.lineNumber;
        this.output = config.output;
        this.exitOnError = config.exitOnError;
        this.showLoggingLevel = config.showLoggingLevel;
    }

    writeRaw(message) {
        if (this.output instanceof Socket) {
            this.output.write(message)
        } else if(this.output instanceof String) {
            appendFileSync(this.output, message, { encoding: 'utf-8' })
        } else if(this.output instanceof GuildChannel) {
            this.output.send(message)
        }
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