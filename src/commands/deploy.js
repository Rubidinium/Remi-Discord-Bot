import { REST } from "@discordjs/rest";
import fs from "fs";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { TOKEN, CLIENTID, GUILDID } = process.env;
const { Routes } = "discord-api-types";

let commands = [];

const commandFiles = fs
  .readdirSync("./")
  .filter((file) => file.endsWith(".js") && file !== "deploy.js");

for (const file of commandFiles) {
  import(`./${file}`).then((command) => commands.push(command.data));
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
