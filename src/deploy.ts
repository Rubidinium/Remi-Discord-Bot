import dotenv from "dotenv";
dotenv.config();

import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import fs from "fs";
const { TOKEN, CLIENTID, GUILDID } = process.env;

let commands = [];

const commandFiles = fs
  .readdirSync("./src/commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  await import(`./commands/${file}`).then(({ default: command }) => {
    commands.push(command.data);
  });
}

const rest = new REST({ version: "9" }).setToken(TOKEN);

(async () => {
  try {
    console.log("Began registering slash commands");

    await rest.put(Routes.applicationGuildCommands(CLIENTID, GUILDID), {
      body: commands,
    });

    console.log("Successfully completed registering slash commands");
  } catch (e) {
    console.error(e);
  }
})();
