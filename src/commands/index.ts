import { ApplicationCommandData, CommandInteraction, ContextMenuInteraction, PermissionString } from "discord.js";
import { RateLimiter } from "discord.js-rate-limiter";
import { Result } from "ts-results";

export default interface BaseCommand {
    metadata: ApplicationCommandData;
    cooldown?: RateLimiter;
    requireDev?: boolean;
    requireGuild?: boolean;
    requireClientPerms?: PermissionString[];
    requireUserPerms?: PermissionString[];
    execute(intr: CommandInteraction | ContextMenuInteraction): Promise<Result<0, string>>;
// eslint-disable-next-line semi
}
