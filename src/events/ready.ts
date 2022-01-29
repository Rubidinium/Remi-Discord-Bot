import { client, commands } from "..";
import Event from "../structures/Event";
import { discordLogger } from "../utils/logger";
import { ApplicationCommandData } from "discord.js";

const truthyFilter = <T>(x: T | false | undefined | "" | 0): x is T => !!x;

export default class ReadyEvent extends Event {
    constructor() { super("Ready", "ready"); }

    async exec() {
        discordLogger.info(`🤖 Logged in as ${client?.user?.tag}!`);
        discordLogger.info(`📊 Currently in ${client?.guilds.cache.size} guilds.`);

        if (["deploy", "register", "edit"].includes(process.argv[2])) {
            discordLogger.debug("Fetching application...");
            await client.application?.commands.fetch();
            discordLogger.debug(`Fetched ${client.application?.commands.cache.size} commands.`);
        }

        if (process.argv[2] === "deploy" || process.argv[2] === "register") {
            const deploy = process.argv[2] === "deploy";

            discordLogger.info(`${deploy ? "Deploying" : "Registering"} ${commands.size} command${commands.size > 1 ? "s" : ""}...`);

            const commandsToDeploy =
                !deploy ? commands.filter(c => client.application?.commands.cache.some(cmd => cmd.name === c.metaData.name) === false).values()
                    : commands.values();

            for (const command of commandsToDeploy) {
                discordLogger.debug(`${deploy ? "Deploying" : "Registering"} command ${command.metaData.name}...`);
                await client.application?.commands.create(command.build(client));
                discordLogger.debug(`${deploy ? "Deployed" : "Registered"} command ${command.metaData.name}.`);
            }

            discordLogger.info(`${deploy ? "Deployed" : "Registered"} ${commands.size} command${commands.size > 1 ? "s" : ""}.`);
        }

        if (process.argv[2] === "edit") {
            const commandNames = process.argv.slice(3).map(cmd => cmd.toLowerCase());
            const commandsToEdit = commandNames.map(c => commands.get(c)).filter(truthyFilter);

            if (!commandsToEdit.length) {
                discordLogger.warn("Edit option requires at least one valid command to edit.");
                return;
            }

            discordLogger.info(`Editing ${commandsToEdit.length} commands...`);
            discordLogger.debug(commandsToEdit.map(cmd => cmd.metaData.name).join(", "));

            const dataForCommands = commandsToEdit.map(cmd => client.application?.commands.cache.find(c => c.name === cmd.metaData.name));

            for (const command of commandsToEdit) {
                const commandData = dataForCommands.find(c => c?.name === command.metaData.name);
                if (!commandData) {
                    discordLogger.warn(`Could not find command ${command.metaData.name}, registering it instead.`);
                    await client.application?.commands.create(command.build(client));
                    discordLogger.info(`Registered command ${command.metaData.name}.`);
                } else {
                    discordLogger.debug(`Editing command ${command.metaData.name}...`);
                    commandData.edit(command.build(client) as unknown as ApplicationCommandData);
                    discordLogger.debug(`Edited command ${command.metaData.name}.`);
                }
            }
        }
    }
}