import dotenv from "dotenv";
dotenv.config();

import {
  Client,
  Collection,
  Intents,
  MessageActionRow,
  MessageSelectMenu,
} from "discord.js";

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
    if (interaction.customId === "register") {
      interaction.reply({
        content: "We have sent you an application form in your dms.",
        ephemeral: true,
      });
      const user = interaction.user;

      let registerCourses = [];
      courses.forEach((course) => {
        interaction.values.forEach((value) => {
          if (course.id === value) {
            registerCourses.push(course);
          }
        });
      });
      const application = { user };

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

      user.send({
        components: [row],
      });

      client.on("interactionCreate", (interaction) => {
        if (!interaction.isSelectMenu()) return;
        if (interaction.customId === "age") {
          application.age = interaction.values[0];
        }
      });

      // dmMessage.channel
      //   .awaitMessages((msg) => true, { max: 1 })
      //   .then((messages) => {
      //     const msg = messages.first();
      //   });
    }
    console.log("Message Component");
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
