import dotenv from "dotenv";
dotenv.config();

import { Client, Collection, Intents } from "discord.js";
import fs from "fs";

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});

const commands = new Collection();

const commandFiles = fs
  .readdirSync("./src/commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  await import(`./commands/${file}`).then(({ default: command }) => {
    commands.set(command.data.name, command);
  });
}

client.once("ready", async () => {
  console.log(`${client.user.username} is ready.`);
  client.user.setActivity("/help", { type: "LISTENING" });
});

client.on("interactionCreate", (interaction) => {
  // console.log(interaction);
  if (!interaction.isCommand()) return;
  const { commandName } = interaction;
  commands.get(commandName).execute(interaction);
});

client.login(process.env.TOKEN);
