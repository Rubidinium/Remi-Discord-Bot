import dotenv from "dotenv";
dotenv.config();

import {
  Client,
  Collection,
  Intents,
  MessageActionRow,
  MessageSelectMenu,
} from "discord.js";
import apps from "./schemas/apps.js";
const { Application, getOrMakeApplication } = apps;

import { createRequire } from "module";
const require = createRequire(import.meta.url);
import { courses } from "./commands/courses.js";

const { MONGO } = process.env,
  { connect, connection, model, Schema, Types } = require("mongoose");

import fs from "fs";

class Mongo {
  constructor(client) {
    this.client = client;

    connect(MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: false,
      connectTimeoutMS: 10000,
      family: 4,
    });

    connection.on("connected", () => console.log("MongoDB connected"));
    connection.on("disconnected", () =>
      console.log("MongoDB disconnected! - - - - - - - - - - - - -")
    );
    connection.on("err", () =>
      console.log("There was an error connecting to MongoDB")
    );
  }
}

class Gary extends Client {
  courses = courses;
  constructor(options) {
    super(options);
    this.Mongo = {
      new: new Mongo(this),
      Application,
      getOrMakeApplication: async (id) => {
        let application = await Application.findOne({ _id: id });
        if (!application) {
          application = new Application(await getOrMakeApplication(id));
        }
        return application;
      },
    };
  }
}

const client = new Gary({
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
  const registerMessage = await client.channels.cache
    .get("884159007139459083")
    .messages.fetch("889207228479963147");
  const row = new MessageActionRow().addComponents(
    new MessageSelectMenu()
      .setCustomId("register")
      .setPlaceholder("Select the courses you want to register for")
      .setMinValues(1)
      .setMaxValues(courses.length)
      .addOptions(
        courses.map((course) => {
          return {
            label: course.name,
            description: course.description,
            value: course.id,
          };
        })
      )
  );

  registerMessage.edit({
    content:
      "To register for one of our courses select from options in the dropdown menu",
    components: [row],
  });
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isButton()) {
    const user = interaction.user;
    switch (interaction.customId) {
      case "register":
      case "age":
        break;

      case "back":
      case "forward":
      case "accept":
      case "reject":
        import('./interactions/courses.js').then(courses => {
            courses.handle(interaction, client);
        })
        break;
    }
  }

  if (interaction.isCommand()) {
    const command = commands.get(interaction.commandName);
    try {
      await command.execute(interaction, client);
    } catch (e) {
      console.error(e);
      await interaction.reply({
        content:
          "An error occurred while executing this command.\nIf this keeps happening please contact the owner.",
        ephemeral: true,
      });
    }
  }
});
client.login(process.env.TOKEN);
