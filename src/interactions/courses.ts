import { Collection } from "discord.js";
import { courses } from "../commands/courses.js";
import PaginationEmbed from "../embeds/PaginationEmbed.js";

const buttons = new Collection();

buttons.set("back", (interaction) => {
  const currentPage =
    parseInt(interaction.message.embeds[0].footer.text.slice(5).split("/")[0]) -
    1;

  interaction.update(
    new PaginationEmbed(
      {
        title: courses[currentPage - 1].name,
        description: courses[currentPage - 1].description,
        fields: [
          {
            name: "Duration",
            value: courses[currentPage - 1].duration,
            inline: true,
          },
          {
            name: "Price",
            value: courses[currentPage - 1].price,
            inline: true,
          },
        ],
        course: courses[currentPage - 1],
      },
      currentPage
    )
  );
});

buttons.set("forward", (interaction) => {
  const currentPage =
    parseInt(interaction.message.embeds[0].footer.text.slice(5).split("/")[0]) -
    1;
  interaction.update(
    new PaginationEmbed(
      {
        title: courses[currentPage + 1].name,
        description: courses[currentPage + 1].description,
        fields: [
          {
            name: "Duration",
            value: courses[currentPage + 1].duration,
            inline: true,
          },
          {
            name: "Price",
            value: courses[currentPage + 1].price,
            inline: true,
          },
        ],
        course: courses[currentPage + 1],
      },
      currentPage + 2
    )
  );
});

export const handle = (interaction, client) => {
  buttons.get(interaction.customId)(interaction);
};

export { buttons };
