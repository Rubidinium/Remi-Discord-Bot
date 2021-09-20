import { SlashCommandBuilder } from "@discordjs/builders";
import { Permissions, MessageActionRow, MessageSelectMenu } from "discord.js";
import Canvas from "canvas";
import { resolve } from "path";
import { readdirSync } from "fs";

const command = new SlashCommandBuilder()
  .setName("banner")
  .setDescription("Generate a banner")
  .addStringOption((option) =>
    option
      .setName("text")
      .setDescription("The text for the banner")
      .setRequired(true)
  )
  .setDefaultPermission(Permissions.FLAGS.MANAGE_MESSAGES);

export default {
  data: command.toJSON(),
  async execute(interaction) {
    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("intent")
        .setPlaceholder("Default")
        .addOptions([
          {
            label: "Default",
            value: "default",
          },
          {
            label: "HR",
            value: "hr",
          },
          {
            label: "Academics",
            value: "academics",
          },
          {
            label: "Special",
            value: "special",
          },
          {
            label: "Tech",
            value: "tech",
          },
        ])
    );
    client.on("interactionCreate", async (inter) => {
      let intent = getIntents().filter((i) => i.name == inter.values[0])[0];
      const variant = Math.ceil(Math.random() * intent.count);

      const background = await Canvas.loadImage(
        `assets/intents/${inter.values[0]}/${variant}.png`
      );

      message.reply({
        files: [basicCanvas(context, background, text, canvas)],
      });
    });
  },
};

function basicCanvas(context, background, text, canvas) {
  context.drawImage(background, 0, 0, canvas.width, canvas.height);
  context.font = "60px Mont Bold";
  context.textAlign = "center";
  context.fillStyle = "rgba(255, 255, 255, .3)";
  context.fillText(text, canvas.width / 2 + 2, canvas.height / 2 + 22);
  context.fillStyle = "#FFFFFF";
  context.fillText(text, canvas.width / 2 - 2, canvas.height / 2 + 18);
  return new MessageAttachment(canvas.toBuffer(), "banner.png");
}

function getIntents() {
  let names = readdirSync(resolve(__dirname, "../../../assets/intents"), {
    withFileTypes: true,
  })
    .filter((dirent) => dirent.isDirectory())
    .map((directory) => {
      return {
        name: directory.name,
        count: 0,
      };
    });

  for (let i = 0; i < names.length; i++) {
    names[i].count = readdirSync(
      resolve(__dirname, "../../../assets/intents", names[i].name)
    ).length;
  }

  return names;
}

// /*
// This is an incredible bot written in javascript (which is objectively better than python) by max and zim.
// */

// const { resolve } = require("path");
// const { readdirSync } = require("fs");
// const Commando = require("discord.js-commando");

// const { Permissions, MessageAttachment } = require("discord.js");

// module.exports = class BannerCommand extends Commando.Command {
//     constructor(client) {
//         super(client, {
//             name: "banner",
//             group: "misc",
//             memberName: "banner",
//             description: "Sends a banner with text types of banners include (academics, default, hr, special, ss and tech)",
//             argsType: "multiple",
//         });
//     }

//     async run(message, args) {

//         if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES) &&
//             message.guild
//         )
//             return;

//         if (args.length < 1) {
//             message.reply(
//                 "Incorrect usage. Correct usage: `banner [intent] <message>`"
//             );
//             return;
//         }

//         let text = args.slice(1).join(" ");

//         Canvas.registerFont("assets/font/Mont.ttf", {
//             family: "Mont Bold",
//             weight: "bold",
//         });

//     }
// };

// function getVariantCount(intent) {
//     return readdirSync(resolve(__dirname, "../../../assets/intents", intent))
//         .length;
// }
// import { SlashCommandBuilder } from "@discordjs/builders";
// import { Permissions, MessageActionRow, MessageSelectMenu } from "discord.js";
// import Canvas from  'canvas';
// import { resolve } from "path";
// import { readdirSync } from "fs";

// const command = new SlashCommandBuilder()
//     .setName('banner')
//     .setDescription('Generate a banner')
//     .addStringOption(option =>
//         option
//             .setName('text')
//             .setDescription('The text for the banner')
//             .setRequired(true))
//     .setDefaultPermission(Permissions.FLAGS.MANAGE_MESSAGES)

// export default {
//     data: command.toJSON(),
//     async execute(interaction) {
//         const row = new MessageActionRow()
//             .addComponents(
//                 new MessageSelectMenu()
//                     .setCustomId('intent')
//                     .setPlaceholder('Default')
//                     .addOptions([
//                         {
//                             label: 'Default',
//                             value: 'default'
//                         },
//                         {
//                             label: 'HR',
//                             value: 'hr'
//                         },
//                         {
//                             label: 'Academics',
//                             value: 'academics'
//                         },
//                         {
//                             label: 'Special',
//                             value: 'special'
//                         },
//                         {
//                             label: 'Tech',
//                             value: 'tech'
//                         },

//                     ])
//             );
//         client.on('interactionCreate', inter => {

//             let intent = intents.filter((i) => i.name == args[0].slice(1))[0];
//         variant = Math.ceil(Math.random() * intent.count);

//         background = await Canvas.loadImage(
//             `assets/intents/${args[0].slice(1)}/${variant}.png`
//         );

//         message.reply({
//             files: [basicCanvas(context, background, text, canvas)],
//         });
//         })

//     }
// }

// /*
// This is an incredible bot written in javascript (which is objectively better than python) by max and zim.
// */

// const { resolve } = require("path");
// const { readdirSync } = require("fs");
// const Commando = require("discord.js-commando");

// const { Permissions, MessageAttachment } = require("discord.js");

// module.exports = class BannerCommand extends Commando.Command {
//     constructor(client) {
//         super(client, {
//             name: "banner",
//             group: "misc",
//             memberName: "banner",
//             description: "Sends a banner with text types of banners include (academics, default, hr, special, ss and tech)",
//             argsType: "multiple",
//         });
//     }

//     async run(message, args) {

//         if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES) &&
//             message.guild
//         )
//             return;

//         if (args.length < 1) {
//             message.reply(
//                 "Incorrect usage. Correct usage: `banner [intent] <message>`"
//             );
//             return;
//         }

//         let text = args.slice(1).join(" ");

//         Canvas.registerFont("assets/font/Mont.ttf", {
//             family: "Mont Bold",
//             weight: "bold",
//         });

//     }
// };

// function basicCanvas(context, background, text, canvas) {
//     context.drawImage(background, 0, 0, canvas.width, canvas.height);
//     context.font = "60px Mont Bold";
//     context.textAlign = "center";
//     context.fillStyle = "rgba(255, 255, 255, .3)";
//     context.fillText(text, canvas.width / 2 + 2, canvas.height / 2 + 22);
//     context.fillStyle = "#FFFFFF";
//     context.fillText(text, canvas.width / 2 - 2, canvas.height / 2 + 18);
//     return new MessageAttachment(canvas.toBuffer(), "banner.png");
// }

// function getIntents() {
//     let names = readdirSync(resolve(__dirname, "../../../assets/intents"), {
//             withFileTypes: true,
//         })
//         .filter((dirent) => dirent.isDirectory())
//         .map((directory) => {
//             return {
//                 name: directory.name,
//                 count: 0,
//             };
//         });

//     for (let i = 0; i < names.length; i++) {
//         names[i].count = readdirSync(
//             resolve(__dirname, "../../../assets/intents", names[i].name)
//         ).length;
//     }

//     return names;
// }

// function getVariantCount(intent) {
//     return readdirSync(resolve(__dirname, "../../../assets/intents", intent))
//         .length;
// }
// import { SlashCommandBuilder } from "@discordjs/builders";
// import { Permissions, MessageActionRow, MessageSelectMenu } from "discord.js";
// import Canvas from  'canvas';
// import { resolve } from "path";
// import { readdirSync } from "fs";

// const command = new SlashCommandBuilder()
//     .setName('banner')
//     .setDescription('Generate a banner')
//     .addStringOption(option =>
//         option
//             .setName('text')
//             .setDescription('The text for the banner')
//             .setRequired(true))
//     .setDefaultPermission(Permissions.FLAGS.MANAGE_MESSAGES)

// export default {
//     data: command.toJSON(),
//     async execute(interaction) {
//         const row = new MessageActionRow()
//             .addComponents(
//                 new MessageSelectMenu()
//                     .setCustomId('intent')
//                     .setPlaceholder('Default')
//                     .addOptions([
//                         {
//                             label: 'Default',
//                             value: 'default'
//                         },
//                         {
//                             label: 'HR',
//                             value: 'hr'
//                         },
//                         {
//                             label: 'Academics',
//                             value: 'academics'
//                         },
//                         {
//                             label: 'Special',
//                             value: 'special'
//                         },
//                         {
//                             label: 'Tech',
//                             value: 'tech'
//                         },

//                     ])
//             );
//         client.on('interactionCreate', inter => {

//             let intent = intents.filter((i) => i.name == args[0].slice(1))[0];
//         variant = Math.ceil(Math.random() * intent.count);

//         background = await Canvas.loadImage(
//             `assets/intents/${args[0].slice(1)}/${variant}.png`
//         );

//         message.reply({
//             files: [basicCanvas(context, background, text, canvas)],
//         });
//         })

//     }
// }

// /*
// This is an incredible bot written in javascript (which is objectively better than python) by max and zim.
// */

// const { resolve } = require("path");
// const { readdirSync } = require("fs");
// const Commando = require("discord.js-commando");

// const { Permissions, MessageAttachment } = require("discord.js");

// module.exports = class BannerCommand extends Commando.Command {
//     constructor(client) {
//         super(client, {
//             name: "banner",
//             group: "misc",
//             memberName: "banner",
//             description: "Sends a banner with text types of banners include (academics, default, hr, special, ss and tech)",
//             argsType: "multiple",
//         });
//     }

//     async run(message, args) {

//         if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES) &&
//             message.guild
//         )
//             return;

//         if (args.length < 1) {
//             message.reply(
//                 "Incorrect usage. Correct usage: `banner [intent] <message>`"
//             );
//             return;
//         }

//         let text = args.slice(1).join(" ");

//         Canvas.registerFont("assets/font/Mont.ttf", {
//             family: "Mont Bold",
//             weight: "bold",
//         });

//     }
// };

// function basicCanvas(context, background, text, canvas) {
//     context.drawImage(background, 0, 0, canvas.width, canvas.height);
//     context.font = "60px Mont Bold";
//     context.textAlign = "center";
//     context.fillStyle = "rgba(255, 255, 255, .3)";
//     context.fillText(text, canvas.width / 2 + 2, canvas.height / 2 + 22);
//     context.fillStyle = "#FFFFFF";
//     context.fillText(text, canvas.width / 2 - 2, canvas.height / 2 + 18);
//     return new MessageAttachment(canvas.toBuffer(), "banner.png");
// }

// function getIntents() {
//     let names = readdirSync(resolve(__dirname, "../../../assets/intents"), {
//             withFileTypes: true,
//         })
//         .filter((dirent) => dirent.isDirectory())
//         .map((directory) => {
//             return {
//                 name: directory.name,
//                 count: 0,
//             };
//         });

//     for (let i = 0; i < names.length; i++) {
//         names[i].count = readdirSync(
//             resolve(__dirname, "../../../assets/intents", names[i].name)
//         ).length;
//     }

//     return names;
// }

// function getVariantCount(intent) {
//     return readdirSync(resolve(__dirname, "../../../assets/intents", intent))
//         .length;
// }
