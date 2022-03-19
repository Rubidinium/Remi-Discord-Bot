import { Client, GuildMember, MessageEmbed, User } from "discord.js";

const LOG_CHANNEL_ID = "953053709909250134";

export default class ModerationLogger {
  constructor(private client: Client) {}

  ban(
    user: GuildMember,
    moderator: User,
    reason: string,
    duration: string = undefined
  ) {
    this.log({ action: "Banned", user, moderator, reason, duration });
  }

  mute(
    user: GuildMember,
    moderator: User,
    reason: string,
    duration: string = undefined
  ) {
    this.log({ action: "Muted", user, moderator, reason, duration });
  }

  kick(user: GuildMember, moderator: User, reason: string) {
    this.log({ action: "Kicked", user, moderator, reason });
  }

  warn(user: GuildMember, moderator: User, reason: string) {
    this.log({ action: "Warned", user, moderator, reason });
  }

  log({
    action,
    user,
    moderator,
    reason,
    duration,
  }: {
    action: string;
    user: GuildMember;
    moderator: User;
    reason: string;
    duration?: string;
  }) {
    const channel = this.client.channels.cache.get(LOG_CHANNEL_ID);
    const embed = new MessageEmbed()
      .setTitle(action)
      .setFields([
        { name: "User", value: `${user}`, inline: true },
        { name: "Moderator", value: `${moderator}`, inline: true },
        { name: "Reason", value: `${reason}` },
      ])
      .setTimestamp(Date.now());

    duration && embed.addField("Duration", duration);

    if (channel.isText()) {
      channel.send({
        embeds: [embed],
      });
    }
  }
}
