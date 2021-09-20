import { MessageEmbed, MessageActionRow, MessageButton } from "discord.js";

export default class PaginationEmbed {
    constructor(page, pageCount, client) {
        this.embed = new MessageEmbed()
            .setColor('RANDOM')
            .setTitle(page.title)
            .setAuthor('Gary')
            .setDescription(page.description)
            .addFields(page.fields)
            .setFooter(`Page 1/${pageCount}`)

        this.row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('back')
                    .setEmoji('889310059899797534')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('decline')
                    .setEmoji('889310059975311380')
                    .setStyle('DANGER'),
                new MessageButton()
                    .setCustomId('accept')
                    .setEmoji('889310059501342751')
                    .setStyle('SUCCESS'),
                new MessageButton()
                    .setCustomId('forward')
                    .setEmoji('889310059903975495')
                    .setStyle('PRIMARY')
            )
        return {
            embeds: [this.embed],
            components: [this.row]
        }
    }
}