import { Client, Intents, } from "discord.js";
import { config } from "dotenv";
config();

class Bot extends Client {
	constructor() {
		super({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS]});
		this.once("ready", () => {
			console.log("ready");
			this.user?.setActivity({
				name: "hazim is gay",
				type: "COMPETING"
			});

		});
		this.login(process.env.TOKEN || "urmom");
	}
}

(() => {
	const bot = new Bot();
	
})();