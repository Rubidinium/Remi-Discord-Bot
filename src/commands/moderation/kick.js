const Commando = require("discord.js-commando");

module.exports = class KickCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "kick",
      group: "moderation",
      memberName: "kick",
      description: "Kicks a member from the discord server",
      clientPermissions: ["KICK_MEMBERS"],
      userPermissions: ["KICK_MEMBERS"],
      guildOnly: true,
    });
  }

  async run(message, args) {
    const target = message.mentions.users.first();
    if (!target) {
      return message.say("You must mention a user to kick.");
    }
    const reason = args.split(" ")[1] ?? "No reason was given.";
    if (!message.guild)
      return message.say("You must be in a guild to use this command.");
    const member = message.guild.members.cache.get(target.id);
    if (!member.kickable)
      return message.say("I do not have the permission to kick that user");

    await member.send(
      `You were kicked from the server by ${message.author.tag} for
\`${reason}\``
    );
    member.kick(reason);
    message.say("Kicked " + target.username + " from the server.");
  }
};
