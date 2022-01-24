import { ApplicationCommandData, UserContextMenuInteraction } from "discord.js";
import { ApplicationCommandTypes } from "discord.js/typings/enums";
import { Result, Ok } from "ts-results";

import BaseCommand from ".";

export default class TestCommand implements BaseCommand {
	public metadata: ApplicationCommandData = {
		name: "ticketban",
		type: ApplicationCommandTypes.USER,
		defaultPermission: true,
	};

	public async execute(interaction: UserContextMenuInteraction): Promise<Result<0, string>> {
		const r = Math.random() * 3;
		if (interaction.targetUser.id == "554052094718640129") {
			interaction.followUp("macks is healthy :sunglasses:");
		} else {
			interaction.followUp(interaction.targetUser.username + ["is fat", "is obese", "is diabetic"][Math.floor(r)]);
		}
		return Ok(0);
	}
}
