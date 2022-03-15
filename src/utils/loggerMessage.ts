import { Client, ColorResolvable, MessageEmbed, User } from "discord.js";

const LOG_CHANNEL_ID = "953053709909250136";
const TRANSCRIPT_CHANNEL_ID = "953053709909250137";

export default class Logger {
  constructor(private name: string, private client: Client) {}

  ticketClose(author: User) {
    this.send("RED", "Closed", author);
  }

  ticketOpen(author: User) {
    this.send("BLURPLE", "Opened", author);
  }

  ticketReopen(author: User) {
    this.send("YELLOW", "Reopened", author);
  }

  saveTranscript(category: string, url: string, author: User, ticketOwner: User) {
    const embed = new MessageEmbed()
      .setTitle("Transcript Saved")
      .setFields([
        { name: "Ticket Owner", value: `${ticketOwner.tag}`, inline: true },
        { name: "Ticket Category", value: `${category}`, inline: true },
        { name: "Action", value: "Transcript Saved", inline: true },
        { name: "URL", value: `[View Transcript](${url})`, inline: true },
      ])
      .setColor("AQUA")
      .setTimestamp(Date.now())
      .setAuthor({
        name: author.username,
        iconURL: author.avatarURL(),
        url: url,
      });

    const channel = this.client.channels.cache.get(TRANSCRIPT_CHANNEL_ID);
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

    const channel = this.client.channels.cache.get(LOG_CHANNEL_ID);
    if (channel.isText()) {
      channel.send({ embeds: [embed] });
    }
  }
}
