import { Client, EmbedField, Guild, GuildMember, MessageActionRow, MessageButton, MessageEmbed, TextChannel } from "discord.js";
import express, { Express, Request, Response } from "express";
import getRoles from "./util/getRoles";
import cors from "cors";

interface ServerOpts {
	port: number,
}

interface ApplicationBody {
	id: string,
	courses: string[],
}

/**
 * The server class
 */
export class Server {
	private client: Client;
	private app: Express;
	private port: number;

	/**
	 * @constructor
	 * @param {Client} client the discord API client
	 * @param {ServerOpts} options options (port etc)
	 */
	constructor(client: Client, options: ServerOpts) {
		this.client = client;
		this.port = options.port;

		/**
		 * Express config
		 */
		this.app = express();
	}

	/**
	 * @method expressConfig the express configuration method
	 */
	public expressConfig() {

		this.app.use(cors());
		this.app.use(express.json());
		this.app.post("/api/applications", this.sendEmbed);
		this.app.get("/api/roles", this.getRoles);
		this.app.listen(this.port, () => {
			console.log(`REST API listening on http://localhost:${this.port}`);
		});
	}
	/**
	 * @method sendEmbed send an embed for a role application
	 * @param {Request} req the request object
	 * @param {Response} res the response object (ew)
	 */
	private sendEmbed = async (req: Request, res: Response) => {
		const body: ApplicationBody = req.body;
		const guild = this.client.guilds.cache.get("877584374521008199");

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const channel: TextChannel = guild?.channels.cache.get("903888105143173150");
		const embed = this.buildEmbed(guild, await guild?.members.fetch(body.id).catch(), body.courses);
		const row = this.getRow(body.id, body.courses);
		channel.send({ embeds: [embed], components: [row] });

		res.send("gay amongus");
	};

	/**
	 * @method buildEmbed builds the embed for the the moderator to accept
	 * @param {GuildMember | undefined } member the guild member to build the embed for
	 * @param {string[]} courses the courses for the member to be enrolled in
	 * @returns the constructed embed
	 */
	private buildEmbed(guild: Guild | undefined, member: GuildMember | undefined, courses: string[]): MessageEmbed {
		const embed = new MessageEmbed()
			.setTitle("New course Application")
			.setDescription("welcome to squid game programming simplified edition but its nothing like squid game and im dying rn");
		if (!member) {
			console.log("gay");
			return embed;
		}
		const coursesWithNames = courses.map((course) => {
			const role = guild?.roles.cache.get(course) ?? { name: "Role not found" };
			return { name: role.name, value: course, inline: true };
		});
		embed
			.setThumbnail(member.user.avatarURL() ?? "")
			.addFields(...coursesWithNames.map((course) => ({ name: course.name, value: course.value, inline: true })));
		return embed;
	}

	/**
	 * @method getRow get the MessageActionRow to add to the embed.
	 * @param {string} id the id of the user
	 * @param {string[]} courses the array of course names
	 * @returns the MessageActionRow to add to the embed
	 */
	private getRow(id: string, courses: string[]): MessageActionRow {
		const accept = new MessageButton()
			.setLabel("Accept")
			.setCustomId(`accept_${id}_${courses.toString()}`)
			.setStyle("SUCCESS")
			.setEmoji("889310059501342751");

		const reject = new MessageButton()
			.setLabel("Reject")
			.setCustomId(`reject_${id}`)
			.setStyle("DANGER")
			.setEmoji("889310059975311380");
		return new MessageActionRow()
			.addComponents(accept, reject);
	}

	/**
	 * @method getRoles the route to get the collection of student roles.
	 * @param {Request} _ the request object, discarded
	 * @param {Response} res the response object to send the information to
	 */
	private getRoles = async (_: Request, res: Response) => {
		res.send(JSON.stringify(await getRoles(this.client), (_, value) =>
			typeof value === "bigint" ? value.toString() : value
		)
		);
	};
}
