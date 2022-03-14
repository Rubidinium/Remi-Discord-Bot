import SlashCommand from "../structures/Command";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

export default class InfoCommand extends SlashCommand {
  constructor() {
    super(
      new SlashCommandBuilder()
        .setName("info")
        .setDescription("Returns information about a user.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user you want to get the info of.")
            .setRequired(true)
        )
    );
  }

  async exec(interaction: CommandInteraction) {
    const guild = interaction.guild;
    console.log(guild);
    const member = guild.members.cache.get(
      interaction.options.getUser("user")?.id
    );
    console.log(member);

    await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setTitle(`${member.user.username} stats`)
          .setColor("#f3f3f3")
          .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
          .addFields(
            {
              name: "Name: ",
              value: member.user.username,
              inline: true,
            },
            {
              name: "#️⃣ Discriminator: ",
              value: `#${member.user.discriminator}`,
              inline: true,
            },
            {
              name: "🆔 ID: ",
              value: member.user.id,
            },
            {
              name: "Current Status: ",
              value: member.presence.status,
              inline: true,
            },
            {
              name: "Activity: ",
              value: member.presence.activities[0]
                ? member.presence.activities[0].name
                : "User isn't playing a game!",
              inline: true,
            },
            {
              name: "Avatar link: ",
              value: `[Click Here](${member.user.displayAvatarURL()})`,
            },
            {
              name: "Creation Date: ",
              value: member.user.createdAt.toLocaleDateString("en-us"),
              inline: true,
            },
            {
              name: "Joined Date: ",
              value: member.joinedAt.toLocaleDateString("en-us"),
              inline: true,
            },
            {
              name: "User Roles: ",
              value: member.roles.cache
                .map((role) => role.toString())
                .join(" ,"),
              inline: true,
            }
          ),
      ],
    });
  }
}
