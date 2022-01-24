import { ApplicationCommandData, CommandInteraction, PermissionString } from "discord.js";
import { RateLimiter } from "discord.js-rate-limiter";

import BaseCommand from ".";

export default class TestCommand implements BaseCommand {
    public metadata: ApplicationCommandData = {
        name: "test",
        description: "test command",
    };
    public cooldown = new RateLimiter(1, 5000);
    public requireDev = false;
    public requireGuild = false;
    public requireClientPerms: PermissionString[] = [];
    public requireUserPerms: PermissionString[] = [];

    public async execute(intr: CommandInteraction) {
        await intr.reply("test commands works!");
    }
}
