import SlashCommand from "../structures/Command";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import Bans from "../models/bans";
import Mutes from "../models/mutes";
import Warns from "../models/warns";

export default class InfractionsCommand extends SlashCommand {
  constructor() {
    super(
      new SlashCommandBuilder()
        .setName("infractions")
        .setDescription("View a specified user's infractions.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to view infractions for.")
            .setRequired(true)
        )
    );
  }

  async exec(interaction: CommandInteraction) {
    const userToView = interaction.guild.members.cache.get(
      interaction.options.getUser("user").id
    );

    if (!userToView) {
      return interaction.reply({
        content:
          "User is not in the server. Please try again with a valid user.",
        ephemeral: true,
      });
    }

    const embed = new MessageEmbed().setTitle("Infractions").setDescription("");

    const promises = [
      Bans.find({ user: userToView.id }).then((bans) => {
        if (!bans.length) {
          embed.addField("Bans", "0", true);
        } else {
          embed.description += "\n\n**Bans:**";
          bans.forEach((ban) => (embed.description += infractionBuilder(ban)));
          embed.addField("Bans", `${bans.length}`, true);
        }
      }),
      Mutes.find({ user: userToView.id }).then((mutes) => {
        if (!mutes.length) {
          embed.addField("Mutes", "0", true);
        } else {
          embed.description += "\n\n**Mutes:**";
          mutes.forEach(
            (mute) => (embed.description += infractionBuilder(mute))
          );
          embed.addField("Mutes", `${mutes.length}`, true);
        }
      }),
      Warns.find({ user: userToView.id }).then((warns) => {
        if (!warns.length) {
          embed.addField("Warns", "0", true);
        } else {
          embed.description += "\n\n**Warns:**";
          warns.forEach(
            (warn) => (embed.description += infractionBuilder(warn))
          );
          embed.addField("Warns", `${warns.length}`, true);
        }
      }),
    ];

    await Promise.all(promises);

    await interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });

    function infractionBuilder(infraction) {
      let description = `\n**Reason**: ${
        infraction.reason
      } | **Time**: ${new Date(
        infraction.createdAt
      ).toLocaleDateString()} | **Mod**: ${interaction.guild.members.cache
        .get(infraction.moderator)
        .toString()}`;

      //   infraction.duration &&
      //     (description += ` | Duration: ${infraction.duration}`);
      description += "";
      return description;
    }
  }
}
