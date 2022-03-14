import SlashCommand from "../structures/Command";
import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

export default class AvatarCommand extends SlashCommand {
  constructor() {
    super(
      new SlashCommandBuilder()
        .setName("avatar")
        .setDescription("Returns an avatar of a user.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user you want to get the avatar of.")
            .setRequired(true)
        )
        .addBooleanOption((option) =>
          option
            .setName("private")
            .setDescription("Whether or not to return an ephemeral message (Only you can see the message).")
            .setRequired(false)
        )

    );
  }

  async exec(interaction: CommandInteraction) {
    await interaction.reply({
      content: interaction.options.getUser("user").avatarURL(),
      ephemeral: interaction.options.getBoolean("private") ?? false,
    });
  }
}
