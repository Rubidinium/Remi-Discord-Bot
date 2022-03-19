import { Client, ColorResolvable, MessageEmbed, User } from "discord.js";
import { configIds } from "..";

export default class TicketLogger {
  constructor(private client: Client) {}

  close(author: User) {
    this.send("RED", "Closed", author);
  }

  open(author: User) {
    this.send("BLURPLE", "Opened", author);
  }

  reopen(author: User) {
    this.send("YELLOW", "Reopened", author);
  }

  saveTranscript(
    category: string,
    url: string,
    author: User,
    ticketOwner: User
  ) {
    const embed = new MessageEmbed()
      .setTitle("Transcript Saved")
      .setFields([
        { name: "Ticket Owner", value: `${ticketOwner.tag}`, inline: true },
        { name: "Ticket Category", value: `${category}`, inline: true },
        { name: "URL", value: `[View Transcript](${url})` },
      ])
      .setColor("AQUA")
      .setTimestamp(Date.now())
      .setAuthor({
        name: author.username,
        iconURL: author.avatarURL(),
        url: url,
      });

    const channel = this.client.channels.cache.get(configIds.ticketLogsClosed);
    if (channel.isText()) {
      channel.send({ embeds: [embed] });
    }
  }

  send(color: ColorResolvable, action: string, author: User) {
    const embed = new MessageEmbed()
      .setTitle("Ticket Action")
      .setFields([
        { name: "Ticket Owner", value: `${author.tag}`, inline: true },
        { name: "Action", value: `${action}`, inline: true },
      ])
      .setColor(color)
      .setTimestamp(Date.now())
      .setAuthor({
        name: author.username,
        iconURL: author.avatarURL(),
      });

    const channel = this.client.channels.cache.get(configIds.ticketLogs);
    if (channel.isText()) {
      channel.send({ embeds: [embed] });
    }
  }
}
