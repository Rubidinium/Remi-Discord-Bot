import { client, commands } from "..";
import Event from "../structures/Event";
import { discordLogger, mongoLogger } from "../utils/logger";
import mongoose from "mongoose";

export default class ReadyEvent extends Event {
  constructor() {
    super("Ready", "ready");
  }

  async exec() {
    mongoose
      .connect(process.env.MONGO, {
        keepAlive: true,
      })
      .then(() => {
        mongoLogger.info("Connected to MongoDB");
      }).catch((err) => {
        mongoLogger.error("Failed to connect to MongoDB:", err);
      });

    discordLogger.info(`🤖 Logged in as ${client?.user?.tag}!`);
    const guild = await client.guilds.fetch("924860504302821377");

    if (["deploy", "register"].includes(process.argv[2])) {
      discordLogger.debug("Fetching application...");
      await guild.commands.fetch();
      discordLogger.debug(`Fetched ${guild.commands.cache.size} commands.`);
    }

    if (process.argv[2] === "deploy" || process.argv[2] === "register") {
      const deploy = process.argv[2] === "deploy";

      discordLogger.info(
        `${deploy ? "Deploying" : "Registering"} ${commands.size} command${
          commands.size > 1 ? "s" : ""
        }...`
      );

      const commandsToDeploy = !deploy
        ? commands
            .filter(
              (c) =>
                guild.commands.cache.some(
                  (cmd) => cmd.name === c.metaData.name
                ) === false
            )
            .values()
        : commands.values();

      for (const command of commandsToDeploy) {
        discordLogger.debug(
          `${deploy ? "Deploying" : "Registering"} command ${
            command.metaData.name
          }...`
        );
        const guildCommand = await guild.commands.create(command.build(client));
        if (command.userPermissions)
          await guildCommand.permissions.set({
            permissions: command.userPermissions,
          });
        discordLogger.debug(
          `${deploy ? "Deployed" : "Registered"} command ${
            command.metaData.name
          }.`
        );
      }

      discordLogger.info(
        `${deploy ? "Deployed" : "Registered"} ${commands.size} command${
          commands.size > 1 ? "s" : ""
        }.`
      );
    }
  }
}
