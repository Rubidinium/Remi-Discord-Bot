import { client, commands } from "..";
import Event from "../structures/Event";
import { discordLogger, mongoLogger } from "../utils/logger";
import mongoose from "mongoose";
import Ban from "../models/ban";
import Mute from "../models/mute";
// import { MessageActionRow, MessageButton, TextChannel } from "discord.js";

export default class ReadyEvent extends Event {
  constructor() {
    super("Ready", "ready");
  }

  async exec() {
    //     const arrow = client.emojis.cache.find(
    //       (emoji) => emoji.name === "APSS_PandaBowTie"
    //     );
    //     client.channels.fetch("953053710240604181").then((channel: TextChannel) =>
    //       channel.send({
    //         content: `Our community is here to help students with their programming troubles, not to provide an unfair advantage by answering test questions. In order to maintain a positive environment, we request that you please be courteous to all helpers!
    // *Response time may vary for certain periods of the day.*

    // **📋 TeXit Bot LaTeX Tutorial**
    // <https://docs.google.com/document/d/1sPgQKmeUr2S8SHI43QAgwiwLmcSb62h08lEyqpTwQsw/edit?usp=sharing>

    // **How to Get Help:**
    // > Click on the button to start the process.
    // > Below, select what you need help with.
    // > Send your question in the ticket that appears.`,
    //         // > ${arrow}  Click on the button to start the process.
    //         // > ${arrow}  Below, select what you need help with.
    //         // > ${arrow}  Send your question in the ticket that appears.`,
    //         components: [
    //           new MessageActionRow().addComponents(
    //             new MessageButton()
    //               .setCustomId("ticketOpen")
    //               .setLabel("Open Ticket")
    //               .setEmoji("✉️")
    //               .setStyle("SUCCESS")
    //           ),
    //         ],
    //       })
    //     );

    mongoose
      .connect(process.env.MONGO, {
        keepAlive: true,
      })
      .then(() => {
        mongoLogger.info("Connected to MongoDB");
      })
      .catch((err) => {
        mongoLogger.error("Failed to connect to MongoDB:", err);
      });

    discordLogger.info(`🤖 Logged in as ${client?.user?.tag}!`);
    const guild = await client.guilds.fetch("953053708562870312");

    {
      Ban.find().then((bans) => {
        bans.forEach((ban) => {
          setTimeout(async () => {
            await guild.members.unban(ban.user);
            await Ban.deleteOne(ban);
          }, new Date(ban.createdAt).getTime() - Date.now() + ban.duration);
        });
      });

      Mute.find().then((mutes) => {
        mutes.forEach((mute) => {
          setTimeout(async () => {
            await guild.members.cache
              .get(mute.user)
              .roles.remove("954201144480104458");

            await Mute.deleteOne({ _id: mute._id });
          }, new Date(mute.createdAt).getTime() - Date.now() + mute.duration);
        });
      });
    }

    {
      if ("deploy".includes(process.argv[2])) {
        discordLogger.debug("Fetching application...");
        await guild.commands.fetch();
        discordLogger.debug(`Fetched ${guild.commands.cache.size} commands.`);
      }

      if (process.argv[2] === "deploy") {
        discordLogger.info(
          `Deploying ${commands.size} command${commands.size > 1 ? "s" : ""}...`
        );

        for (const command of commands.values()) {
          discordLogger.debug(`Deploying command ${command.metaData.name}...`);
          const guildCommand = await guild.commands.create(
            command.build(client)
          );
          if (command.userPermissions)
            await guildCommand.permissions.set({
              permissions: command.userPermissions,
            });
          discordLogger.debug(`Deployed command ${command.metaData.name}.`);
        }

        discordLogger.info(
          `Deployed ${commands.size} command${commands.size > 1 ? "s" : ""}.`
        );
      }
    }
  }
}
