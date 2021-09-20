import { MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import { courses } from "../commands/courses.js";

export default class PaginationEmbed {
  constructor(page, client, pageNumber) {
    this.embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle(page.title)
      .setAuthor("Gary")
      .setDescription("asdf")
      .addFields(page.fields)
      .setFooter(`Page ${courses.indexOf(page) + 1}/${courses.length}`);

    this.row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("back")
        .setEmoji("889310059899797534")
        .setStyle("PRIMARY")
        .setDisabled(pageNumber == 0),
      new MessageButton()
        .setCustomId("forward")
        .setEmoji("889310059903975495")
        .setStyle("PRIMARY")
    );
    return {
      embeds: [this.embed],
      components: [this.row],
    };
  }
}
