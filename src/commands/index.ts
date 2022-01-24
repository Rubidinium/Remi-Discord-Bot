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
<<<<<<< HEAD
    execute(intr: CommandInteraction | ContextMenuInteraction): Promise<Result<0, string>>;
// eslint-disable-next-line semi
=======
    execute(intr: CommandInteraction): Promise<Result<0, string>>;
>>>>>>> 100ed972581e1bf299dd1de4a617ae02bfa7bfb9
}
