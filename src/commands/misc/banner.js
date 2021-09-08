/*
This is an incredible bot written in javascript (which is objectively better than python) by max and zim.
*/

const { resolve } = require("path");
const { readdirSync } = require("fs");
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
        const intents = getIntents();
        let intentsNames = [];
        intents.forEach((intent) => {
            intentsNames.push(intent.name);
        });
        if (!message.member.permissions.has(Permissions.FLAGS.ATTACH_FILES) &&
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
        const canvas = Canvas.createCanvas(700, 250);
        const context = canvas.getContext("2d");

        let background;
        let variant;
        if (!intentsNames.includes(args[0])) {
            variant = Math.ceil(Math.random() * getVariantCount("default"));
            background = await Canvas.loadImage(`assets/intents/default/${variant}.png`);
            message.reply({
                files: [basicCanvas(context, background, text, canvas)],
            });
            return;
        }
        let intent = intents.filter((i) => i.name == args[0]);
        variant = Math.ceil(Math.random() * intent.length);

        background = await Canvas.loadImage(
            `assets/intents/${args[0]}/${variant}.png`
        );

        message.reply({
            files: [basicCanvas(context, background, text, canvas)],
        });
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

function getVariantCount(intent) {
    return readdirSync(resolve(__dirname, "../../../assets/intents", intent))
        .length;
}