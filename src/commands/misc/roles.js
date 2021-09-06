const Commando = require("discord.js-commando");

module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "roles",
      aliases: ["role"],
      group: "misc",
      memberName: "roles",
      description: "Adds specified role to members",
      argsType: "multiple",
    });
  }

  async run(message, args) {
    
    let teams = ["web", "game", "discord"]; // valid args for teams
    let team = args[0];
    let users = message.mentions.members; // users to add role to

    // declare role ids
    let webRole = message.guild.roles.cache.find(r => r.id === "743531745714110484");
    let gameRole = message.guild.roles.cache.find(r => r.id === "743531745714110484");
    let discordRole = message.guild.roles.cache.find(r => r.id === "743531745714110484");
    
    if (teams.includes(team.toLowerCase())) {
      for (let member of users.values()) {
        switch(team.toLowerCase()) {
          case "web":
            member.roles.add(webRole);
            message.say("All roles added.");
            break;
          case "game":
            member.roles.add(gameRole);
            message.say("All roles added.");
            break;
          case "discord":
            member.roles.add(discordRole);
            message.say("All roles added.");
            break;
        }
      }
    } else {
      message.say(`Invalid team. Valid team options are ${teams}`);
    }

    
  }
};
