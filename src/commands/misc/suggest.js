const Commando = require("discord.js-commando");

module.exports = class SuggestCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "suggest",
      group: "misc",
      memberName: "suggest",
      description: "Make a suggestion to the staff members",
    });
  }

  async run(message, args) {
    const staffChannel = this.client.channels.cache.get("885263299908870174");
    const embed = {
      color: "#EF476F",
      title: "Suggestion",
      author: {
        name: message.author.tag,
        icon_url: message.author.avatarURL(),
      },
      description: args,
      thumbnail: message.author.avatarURL(),
    };
    await staffChannel.send({ embed });
    await message.delete();
  }
};