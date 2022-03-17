import Button from "../structures/Button";
import {
  ButtonInteraction,
  Message,
  MessageActionRow,
  MessageButton,
  TextChannel,
} from "discord.js";
import { ticketLogger } from "..";

export default class TicketReopenButton extends Button {
  constructor() {
    super("ticketReopen");
  }

  async exec(interaction: ButtonInteraction) {
    const channel = interaction.channel as TextChannel;

    channel.permissionOverwrites.edit(
      await interaction.client.users.fetch(channel.name.split("-")[1]),
      {
        VIEW_CHANNEL: true,
      }
    );

    interaction.reply({
      content: `<@${
        channel.name.split("-")[1]
      }> The ticket has been re-opened and is now available to you again.`,
      components: [
        new MessageActionRow().addComponents(
          new MessageButton()
            .setCustomId("ticketConfirm")
            .setLabel("Close Ticket")
            .setEmoji("❌")
            .setStyle("DANGER")
        ),
      ],
    });

    interaction.message.components.forEach((component) => {
      (component as MessageActionRow).components.forEach(
        (button: MessageButton) => {
          button.setDisabled();
        }
      );
    });

    (interaction.message as Message).edit({
      components: interaction.message.components as MessageActionRow[],
    });
    ticketLogger.ticketReopen(interaction.user);
  }
}
