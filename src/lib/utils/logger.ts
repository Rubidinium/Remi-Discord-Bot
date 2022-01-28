import { Client, ColorResolvable, MessageEmbed, Snowflake, User } from "discord.js";

const LOG_CHANNEL_ID = "936320222426701844";
const TRANSCRIPT_CHANNEL_ID = "936320323240992799";

export default class Logger {
	constructor(private name: string, private client: Client) { }

	ticketClose(id: Snowflake, author: User) {
		this.send("RED", "Closed", id, author);
	}

	ticketOpen(id: Snowflake, author: User) {
		this.send("BLURPLE", "Opened", id, author);
	}

	ticketReopen(id: Snowflake, author: User) {
		this.send("YELLOW", "Reopened", id, author);
	}

	saveTranscript(id: Snowflake, url: string, author: User) {
		const embed = new MessageEmbed()
			.setTitle("Ticket Action")
			.setDescription(`Ticket: <#${id}>\nAction: Transcript Saved\nURL: ${url}`)
			.setColor("AQUA")
			.setTimestamp(Date.now())
			.setAuthor({
				name: author.username,
				iconURL: author.avatarURL(),
				url: url
			});

		const channel = this.client.channels.cache.get(TRANSCRIPT_CHANNEL_ID);
		if (channel.isText()) {
			channel.send({ embeds: [embed] });
		}
	}

	send(color: ColorResolvable, action: string, ticketID: Snowflake, author: User) {
		const embed = new MessageEmbed()
			.setTitle("Ticket Action")
			.setDescription(`Ticket: <#${ticketID}>\nAction: ${action}`)
			.setColor(color)
			.setTimestamp(Date.now())
			.setAuthor({
				name: author.username,
				iconURL: author.avatarURL()
			});

		const channel = this.client.channels.cache.get(LOG_CHANNEL_ID);
		if (channel.isText()) {
			channel.send({ embeds: [embed] });
		}
	}
}