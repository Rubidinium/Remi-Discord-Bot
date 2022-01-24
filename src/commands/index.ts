import { ApplicationCommandData, CommandInteraction, PermissionString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

export interface BaseCommand {
    metadata: ApplicationCommandData;
    cooldown?: RateLimiter;
    requireDev: boolean;
    requireGuild: boolean;
    requireClientPerms: PermissionString[];
    requireUserPerms: PermissionString[];
    execute(intr: CommandInteraction): Promise<void>;
}
