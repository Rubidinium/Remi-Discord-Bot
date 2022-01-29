import { Client, Interaction, PermissionResolvable } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types";

export type SlashCommandOptions = {
    requiredPermissions: PermissionResolvable[];
};

export default class SlashCommand {
    metaData: SlashCommandBuilder;
    options: SlashCommandOptions | undefined;

    constructor(metaData: SlashCommandBuilder, options?: SlashCommandOptions) {
        this.metaData = metaData;
        this.options = options;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    exec(interaction: Interaction) {
        throw new Error("Method not implemented.");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    build(client: Client): RESTPostAPIApplicationCommandsJSONBody {
        return this.metaData.toJSON();
    }
}