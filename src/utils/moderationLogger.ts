import {
  Client,
  ColorResolvable,
  GuildMember,
  MessageEmbed,
  User,
} from "discord.js";

const LOG_CHANNEL_ID = "953053709909250134";

export default class TicketLogger {
  constructor(private client: Client) {}

  ban(user: GuildMember, moderator: User, reason: string) {
    this.log({ action: "Banned", user, moderator, reason });
  }

  kick(user: GuildMember, moderator: User, reason: string) {
    this.log({ action: "Kicked", user, moderator, reason });
  }

  log({
    action,
    user,
    moderator,
    reason,
  }: {
    action: string;
    user: GuildMember;
    moderator: User;
    reason: string;
  }) {
    const channel = this.client.channels.cache.get(LOG_CHANNEL_ID);
    if (channel.isText()) {
      channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle("Moderation Action")
            .setFields([
              { name: "User", value: `${user}`, inline: true },
              { name: "Moderator", value: `${moderator}`, inline: true },
              { name: "Action", value: `${action}`, inline: true },
              { name: "Reason", value: `${reason}`, inline: true },
            ])
            .setTimestamp(Date.now())
        ],
      });
    }
  }
}
