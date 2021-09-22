import { SlashCommandBuilder } from "@discordjs/builders";
import { Permissions, MessageActionRow, MessageSelectMenu } from "discord.js";
import Konva from 'konva';
import { resolve } from "path";
import { readdirSync, writeFileSync } from "fs";

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
    
    interaction.update({
      components: [row],
    });

    client.on("interactionCreate", async (inter) => {
        let intent = getIntents().filter((i) => i.name == inter.values[0])[0];
        const variant = Math.ceil(Math.random() * intent.count);
 
        const background = await Canvas.loadImage(
            `assets/intents/${inter.values[0]}/${variant}.png`
        );

        inter.update({
            files: [basicCanvas(context, background, text, canvas)],
            components: [],
        });
	
		let stage = new Konva.Stage({
			container: 'container',
			width: 700,
			height: 250
		});

    
		

		let background = new Konva.Layer();
    stage.add(background)

		let bgRect = new Konva.Rect({
			x: 0, 
			y: 0,
			width: 700,
			height: 250
		});

    Konva.Image.fromURL(resolve(__dirname, '../../assets/intents/default/1.png', image => {
        background.add(image);
        background.draw();

        let data = stage.toDataURL({ pixelRatio: 3 });

        writeFileSync('./out.png', data);
    }))

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