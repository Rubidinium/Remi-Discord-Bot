import dotenv from "dotenv";
dotenv.config();

import {
  Client,
  Collection,
  Intents,
  MessageActionRow,
  MessageSelectMenu,
} from "discord.js";
import Application from "./schemas/apps.js";

import { createRequire } from "module";
const require = createRequire(import.meta.url);

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
  constructor(options) {
    super(options);
    this.Mongo = {
      new: new Mongo(this),
      Application,
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

const courses = [
  {
    name: "Web Development",
    id: "web",
    description: "Learn how to build a website",
    price: "FREE",
    duration: "4 weeks",
    image: "https://i.imgur.com/qQqxQ8l.png",
  },
  {
    name: "Game Development",
    id: "game",
    description: "Learn how to build a game",
    price: "FREE",
    duration: "4 weeks",
    image: "https://i.imgur.com/qQqxQ8l.png",
  },
  {
    name: "Discord Bot Development (JS)",
    id: "bot",
    description: "Learn how to build a discord bot",
    price: "FREE",
    duration: "4 weeks",
    image: "https://i.imgur.com/qQqxQ8l.png",
  },
  {
    name: "Artificial Intelligence",
    id: "ai",
    description: "Learn how to build a AI",
    price: "FREE",
    duration: "8 weeks",
    image: "https://i.imgur.com/qQqxQ8l.png",
  },
];

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
  if (interaction.isMessageComponent()) {
    const user = interaction.user;
    if (interaction.customId === "register") {
      interaction.reply({
        content: "We have sent you an application form in your dms.",
        ephemeral: true,
      });

      let registerCourses = [];
      courses.forEach((course) => {
        interaction.values.forEach((value) => {
          if (course.id === value) {
            registerCourses.push(course);
          }
        });
      });
      const application = new Application({
        _id: Types.ObjectId(),
      });
      application.user = user;
      application.application.courses = registerCourses;

      user.send(
        `Thank you for applying for programming simplified's courses.\n${registerCourses
          .map((registerCourse) => {
            return `\n**${registerCourse.name}**`;
          })
          .join("")}\nPlease answer the following questions to apply`
      );
      const row = new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setCustomId("age")
          .setPlaceholder("Select your age")
          .addOptions([
            {
              label: "13",
              value: "13",
            },
            {
              label: "14",
              value: "14",
            },
            {
              label: "15",
              value: "15",
            },
            {
              label: "16",
              value: "16",
            },
            {
              label: "17",
              value: "17",
            },
            {
              label: "18+",
              value: "18+",
            },
          ])
      );

      application.application.dmMessage = await user.send({
        content: "How old are you?",
        components: [row],
      });

      application.save();
    }
    if (interaction.customId === "age") {
      const application = apps[user.id].application;
      application.application.age = interaction.values[0];
      application.application.dmMessage.edit({
        content: "We have received your age",
        components: [],
      });

      apps.save().then((result) => {
        console.log(result);
      });
    }
  }

  if (interaction.isCommand()) {
    const command = commands.get(interaction.commandName);
    try {
      await command.execute(interaction);
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
