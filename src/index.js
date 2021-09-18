import { Client, Collection, Intents } from "discord.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
import fs from "fs";

import dotenv from "dotenv";
dotenv.config();

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
  .filter((file) => file.endsWith(".ts") && !(file == "deploy.js"));

for (const file of commandFiles) {
  import(`./commands/${file}`).then((command) =>
    commands.set(command.data.name, command)
  );
}

client.once("ready", () => {
  console.log("Bernard is ready.");
});

client.on("interactionCreate", (interaction) => {
  if (!interaction.isCommand()) return;
  const { commandName } = interaction;
  commands.get(commandName).execute(interaction);
});

client.login(process.env.token);
