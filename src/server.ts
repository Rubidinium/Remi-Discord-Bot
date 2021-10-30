import { Client, EmbedField, GuildMember, Message, MessageActionRow, MessageButton, MessageEmbed, TextChannel, User } from "discord.js";
import express, { Express, Request, Response } from "express";
import { Course } from "types";


export namespace Server {
    interface ServerOpts {
        port: number,
    }

    interface ApplicationBody {
        id: string,
        courses: Array<Course>,
        guildId: string,
    }
    export class Server {
        private client: Client;
        private app: Express;
        private port: number;
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
         * @param options the options for the server duh
         */
        public expressConfig(options: ServerOpts) {

            this.app.use(express.json())
            this.app.post('/api/applications', this.sendEmbed);
            this.app.get('/api/roles', this.getRoles)
            this.app.listen(this.port, () => {
                console.log(`REST API listening on http://localhost:${this.port}`)
            })
        }
        /**
         * @method sendEmbed send an embed for a role application
         * @param req the request object
         * @param _res the response object (ew)
         */
        private sendEmbed = async (req: Request, _res: Response) => {
            const body: ApplicationBody = req.body;
            const guild = this.client.guilds.cache.get(body.guildId);
            // @ts-ignore
            const channel: TextChannel = guild?.channels.cache.get('903888105143173150')
            const embed = this.buildEmbed(await guild?.members.fetch(body.id), body.courses)
            const row = this.getRow(body.id, body.courses);
            channel.send({ embeds: [embed], components: [row] })
            _res.send('gay amongus')
        }

        private buildEmbed(member: GuildMember | undefined, courses: Array<Course>): MessageEmbed {
            const embed = new MessageEmbed()
                .setTitle('a')
                .setDescription('welcome to squid game programming simplified edition but its nothing like squid game and im bored asf')
            if (!member){
                console.log('gay')
                return embed
            };
            embed
                
                .setThumbnail(member.user.avatarURL() ?? '')
                .addFields(...courses.map((i): EmbedField => ({ name: i.name, value: i.members.toString(), inline: false })))
            return embed;
        }

        private getRow(id: string, courses: Array<Course>): MessageActionRow {
            const accept = new MessageButton()
                .setLabel('Accept')
                .setCustomId(`accept_${id}_${courses.toString()}`)
                .setStyle('SUCCESS')
                .setEmoji('889310059501342751')
            const reject = new MessageButton()
                .setLabel('Reject')
                .setCustomId(`reject_${id}`)
                .setStyle('DANGER')
                .setEmoji('889310059975311380')
            return new MessageActionRow()
                .addComponents(accept, reject)
        }

        
        private getRoles = async (_: Request, res: Response) => {
            let all = await (await this.client.guilds.fetch('877584374521008199')).roles.fetch();
            let bottomDiv = all.get('884289615719186442')
            let topDiv = all.get('884289534366470197')
            let courseRoles = all.filter(r => r.position > (bottomDiv?.position ?? 0 ) && r.position < (topDiv?.position ?? 69))
            
            res.send(JSON.stringify({ roles: courseRoles }, (key, value) =>
                typeof value === "bigint" ? value.toString() : value
            ))
        }
    }
}

