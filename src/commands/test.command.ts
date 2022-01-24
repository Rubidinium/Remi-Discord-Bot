import { CommandInteraction } from "discord.js";
import { RateLimiter } from "discord.js-rate-limiter";
import { Result, Ok } from "ts-results";

import BaseCommand from ".";

const TestCommand: BaseCommand = {
    metadata: {
        name: "test",
        description: "test",
    },
    cooldown: new RateLimiter(1, 5000),
    requireDev: false,
    requireGuild: false,
    requireClientPerms: [],
    requireUserPerms: [],
    execute: async (intr: CommandInteraction): Promise<Result<0, string>> => {
        intr.reply("test");
        return Ok(0);
    }
};

export default TestCommand;