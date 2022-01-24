import { ApplicationCommandData, CommandInteraction, PermissionString } from "discord.js";
import { RateLimiter } from "discord.js-rate-limiter";
import { Ok, Result } from "ts-results";

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

	public async execute(intr: CommandInteraction): Promise<Result<0, string>> {
		await intr.reply("test commands works!");
		return Ok(0);
	}
}
