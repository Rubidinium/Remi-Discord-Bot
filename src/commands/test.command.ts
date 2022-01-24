import { ApplicationCommandData, CommandInteraction } from "discord.js";
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
