const Commando = require("discord.js-commando");

module.exports = class BananaCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "banana",
      group: "misc",
      memberName: "banana",
      description: "Sends a banana emote",
    });
  }

  async run(message) {
    message.say(":banana:");
  }
};
