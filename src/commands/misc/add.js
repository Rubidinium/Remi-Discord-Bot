const Commando = require("discord.js-commando");

module.exports = class AddCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: "add",
			aliases: ["sum"],
			group: "misc",
			memberName: "add",
			description: "Adds multiple numbers together",
			argsType: "multiple",
		});
	}

	async run(message, args) {
		let sum = 0;
		args.forEach((num) => {
			const parsed = parseFloat(num);
			if(isNaN(parsed)) {
				message.say("you gotta give me an actual number to add lol");
				return;
			}
			sum += parsed;
		});
		message.say(`The sum of ${args.join(" + ")} = ${sum}`);
	}
};
