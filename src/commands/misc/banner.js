/*
This is an incredible bot written in javascript (which is objectively better than python) by max and zim.
*/

const Commando = require("discord.js-commando");
const Canvas = require("canvas");
const { Permissions, MessageAttachment } = require("discord.js");

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
    if (
      !message.member?.permissions?.has(Permissions.FLAGS.ATTACH_FILES) &&
      message.guild
    )
      return;

    if (args.length < 1) {
      message.reply(
        "Incorrect usage. Correct usage: `banner [intent] <message>`"
      );
      return;
    }

    const text = args.slice(1).join(" ");

    Canvas.registerFont("assets/font/Mont.ttf", {
      family: "Mont Bold",
      weight: "bold",
    });

    const canvas = Canvas.createCanvas(1200, 400);
    const context = canvas.getContext("2d");

    let background;
    let variant;

    if (!intents.hasOwnProperty(args[0])) {
      variant = Math.ceil(Math.random() * intents[args[0]]);
      background = await Canvas.loadImage(
        `assets/intents/default/${variant}.png`
      );
      message.reply({
        files: [basicCanvas(context, background, text, canvas)],
      });
      return;
    }
    variant = Math.ceil(Math.random() * intents[args[0]]);

    background = await Canvas.loadImage(
      `assets/intents/${args[0]}/${variant}.png`
    );

    message.reply({ files: [basicCanvas(context, background, text, canvas)] });
  }
};

function basicCanvas(context, background, text, canvas) {
  context.drawImage(background, 0, 0, canvas.width, canvas.height);
  context.font = "70px Mont Bold";
  context.textAlign = "center";
  context.fillStyle = "rgba(255, 255, 255, .3)";
  context.fillText(text, canvas.width / 2 + 2, canvas.height / 2 + 22);
  context.fillStyle = "#FFFFFF";
  context.fillText(text, canvas.width / 2 - 2, canvas.height / 2 + 18);
  return new MessageAttachment(canvas.toBuffer(), "banner.png");
}
