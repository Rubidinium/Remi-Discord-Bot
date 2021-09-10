require("dotenv").config();
const { token } = process.env;

const {join} = require("path");
const { CommandoClient } = require("discord.js-commando");

const client = new CommandoClient({
  owner: "682715516456140838",
  commandPrefix: "-",
});

client.once("ready", async () => {
  console.log("Gary is ready :)");
  console.log(join(__dirname, "commands"));
  client.user.setActivity(`${client.commandPrefix}help`, {
    type: "LISTENING",
  });
  client.registry
    .registerGroups([
      ["misc", "Misc commands"],
      // ["moderation", "Moderation commands"],
    ])
    .registerDefaults()
    .registerCommandsIn(join(__dirname, "commands"));
});

client.login(token);
