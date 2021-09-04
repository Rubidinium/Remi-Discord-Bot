const {Command} = require("discord.js-commando");

module.exports = class PurgeCommand extends Command {
  constructor(client) {
    super(client, {
      name: "purge",
      aliases: ["clean", "remove", "prge"],
      group: "moderation",
      memberName: "purge",
      description: "Purges specific amount of messages",
      userPermissions: ["MANAGE_MESSAGES"],
      guildOnly: true,
    });
  }
  async run(message, args) {
    try {
      const numberOfMessagesToDelete = parseInt(args);
    } catch {
      message.say("Please enter a valid number of messages to delete.");
    }
  }
};
