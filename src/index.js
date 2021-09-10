require("dotenv").config();
const { token } = process.env;

const path = require("path");
const { CommandoClient } = require("discord.js-commando");

const client = new CommandoClient({
  owner: "682715516456140838",
  commandPrefix: "-",
});

client.once("ready", async() => {
    console.log("Gary is ready :)");
    client.user.setActivity(`${client.commandPrefix}help`, {
        type: "LISTENING",
    });
    client.registry
        .registerGroups([
            ["misc", "Misc commands"],
            // ["moderation", "Moderation commands"],
        ])
        .registerDefaults()
        .registerCommandsIn(path.join(__dirname, "commands"));
});

client.login(token);