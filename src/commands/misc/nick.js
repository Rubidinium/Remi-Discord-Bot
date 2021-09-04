const Commando = require("discord.js-commando");

module.exports = class KickCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "nick",
      group: "misc",
      memberName: "nick",
      description: "Changes a persons nickname to whatever you want",
      guildOnly: true,
    });
  }

  async run(message, args) {
    if (!message.guild)
      return message.say("You must be in a guild to use this command.");
    const target = message.mentions.users.first();
    if (!target) {
      return message.say("You must mention a user.");
    }

    const member = message.guild.members.cache.get(target.id);
    try {
      await member.setNickname(args.split(`<@!${target.id}>`)[1].trim());
    } catch {
      message.say(
        "I can not change their nickname. This is most likely because I don't have permission."
      );
    }
  }
};
