import { ApplicationCommandData, CommandInteraction, PermissionString } from "discord.js";
import { RateLimiter } from "discord.js-rate-limiter";
import { Result } from "ts-results";

export default interface BaseCommand {
    metadata: ApplicationCommandData;
    cooldown?: RateLimiter;
    requireDev?: boolean;
    requireGuild?: boolean;
    requireClientPerms?: PermissionString[];
    requireUserPerms?: PermissionString[];
    execute(intr: CommandInteraction): Promise<Result<0, string>>;
}
