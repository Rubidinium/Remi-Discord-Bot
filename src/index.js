import { Client, Collection, Intents } from "discord.js";
import fs from "fs";

// import dotenv from "dotenv";
// dotenv.config();

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});

const commands = new Collection();
const commandFiles = fs.readdirSync("./commands");

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

client.once("ready", () => {
  console.log(`${client.name} is ready.`);
});

client.on("interactionCreate", (interaction) => {
  if (!interaction.isCommand()) return;
  const { commandName } = interaction;
  commands.get(commandName).execute(interaction);
});

client.login(process.env.token);
