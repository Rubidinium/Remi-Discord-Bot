/*
This is an incredible bot written in javascript (which is objectively better than python) by max and zim.
*/

const Commando = require("discord.js-commando");
const Canvas = require("canvas");
const { Permissions } = require("discord.js");

module.exports = class BannerCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "banner",
      group: "misc",
      memberName: "banner",
      description: "Sends a banner with text",
      argsType: "multiple",
    });
  }

  async run(message, args) {
    const intents = { text: 2, ss: 8, tech: 6, info: 8, hr: 3, general: 24 };
    if (!message.member.permissions.has(Permissions.FLAGS.ATTACH_FILES)) return;

    if (args.length < 2) {
      message.reply(
        "Incorrect usage. Correct usage: `banner <intent> <message>`"
      );
      return;
    }
    console.log(args);
    if (!intents.hasOwnProperty(args[0])) {
      message.reply(
        `Incorrect usage. Intent was not one of \`${Object.keys(intents).join(
          ", "
        )}\``
      );
      return;
    }

    let text = args.slice(1);
    let variant = Math.ceil(Math.random() * intents[args[0]]);

    Canvas.registerFont("assets\\font\\Mont.ttf", {
      family: "Mont Bold",
      weight: "bold",
    });

    const canvas = Canvas.createCanvas(700, 250);
    const context = canvas.getContext("2d");

    const background = await Canvas.loadImage(
      `assets\\intents\\${args[0]}\\${variant}.png`
    );

    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    context.font = "60px Mont Bold";
    context.textAlign = "center";
    context.fillStyle = "rgba(255, 255, 255, .3)";
    context.fillText(
      text.join(" ").toUpperCase(),
      canvas.width / 2 + 2,
      canvas.height / 2 + 22
    );
    context.fillStyle = "#FFFFFF";
    context.fillText(
      text.join(" ").toUpperCase(),
      canvas.width / 2 - 2,
      canvas.height / 2 + 18
    );
    const attachment = new MessageAttachment(canvas.toBuffer(), "banner.png");
    message.reply({ files: [attachment] });
  }
};
