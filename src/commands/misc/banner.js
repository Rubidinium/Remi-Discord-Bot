const Commando = require("discord.js-commando");
const Canvas = require("canvas");
module.exports = class BananaCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "banner",
      group: "misc",
      memberName: "banana",
      description: "Sends a banana emote",
    });
  }
  async run(message) {
    const prefix = "banner ";
    const intents = { text: 2, ss: 8, tech: 6, info: 8, hr: 3, general: 24 };

    if (message.author.bot) return;
    if (
      !(
        message.member.roles.cache.find((r) => r.name == "Moderator") ||
        message.member.roles.cache.find((r) => r.name == "Leadership")
      )
    )
      return;
    const content = message.content.toLowerCase();
    if (!content.startsWith(prefix)) return;

    const args = content.split(" ").slice(1);
    if (args.length < 2) {
      message.reply(
        "Incorrect usage. Correct usage: `banner <intent> <message>`"
      );
      return;
    }

    if (!intents.hasOwnProperty(args[0])) {
      message.reply(
        "Incorrect usage. Intent was not one of `'text', 'ss', 'tech', 'information', 'hr', 'general'`"
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
