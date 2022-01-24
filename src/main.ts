import { Client, Intents, } from "discord.js";
import { config } from "dotenv";
config();

class Bot extends Client {
	constructor() {
		super({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS] });

	}
}


const client = new Bot();
client.once("ready", () => {
	console.log("ready");
	client.user?.setActivity({

		type: "COMPETING"
	});

});
client.login(process.env.TOKEN);
