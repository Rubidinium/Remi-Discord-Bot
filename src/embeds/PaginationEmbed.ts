import { MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import { courses, Course } from "../commands/courses";

type Page = {
  title: string,
  description: string,
  fields: [
    { name: string, value: string, inline: boolean },
    { name: string, value: string, inline: boolean },
  ],
  course: Course,
}

export default class PaginationEmbed {
  private embed: MessageEmbed;
  private row: MessageActionRow;
  constructor(page: Page, pageNumber: number) {
    this.embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle(page.title)
      .setAuthor("Gary")
      .setDescription(page.description)
      .addFields(page.fields)
      .setFooter(`Page ${courses.indexOf(page.course) + 1}/${courses.length}`);

    this.row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("back")
        .setEmoji("889310059899797534")
        .setStyle("PRIMARY")
        .setDisabled(pageNumber == 1),
      new MessageButton()
        .setCustomId("forward")
        .setEmoji("889310059903975495")
        .setStyle("PRIMARY")
        .setDisabled(pageNumber == courses.length)
    );


  }

  get message() {
    return {
      embeds: [this.embed],
      components: [this.row],
    };
  }
}
