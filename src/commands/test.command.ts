import { ApplicationCommandData, CommandInteraction, PermissionString } from "discord.js";
import { RateLimiter } from "discord.js-rate-limiter";
import { Result, Ok } from "ts-results";

import BaseCommand from ".";

export default class TestCommand implements BaseCommand {
    public metadata: ApplicationCommandData = {
        name: "test",
        description: "test command",
    };

    public async execute(intr: CommandInteraction): Promise<Result<0, string>> {
        await intr.reply("test commands works!");
        return Ok(0);
    }
}
