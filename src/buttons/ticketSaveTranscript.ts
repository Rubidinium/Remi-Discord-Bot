import Button from "../structures/Button";
import {
  ButtonInteraction,
  Message,
  MessageActionRow,
  MessageAttachment,
  MessageButton,
  TextChannel,
} from "discord.js";
import { createTranscript } from "discord-html-transcripts";
import { createTranscriptNotion } from "../utils/notion";
import { ticketLogger } from "..";

export default class TicketSaveTranscriptsButton extends Button {
  constructor() {
    super("ticketSaveTranscript");
  }

  async exec(interaction: ButtonInteraction) {
    await interaction.deferReply();
    let saved = false;
    interaction.message.components.forEach((component) => {
      (component as MessageActionRow).components.forEach(
        (button: MessageButton) => {
          if (button.customId == "ticketSaveTranscript" && button.disabled)
            saved = true;
        }
      );
    });

    if (saved) return;

    const transcriptFile = (await createTranscript(
      interaction.channel as TextChannel
    )) as MessageAttachment;

    const channel = interaction.channel as TextChannel;
    const block_id =
      channel.name.split("-")[channel.name.split("-").length - 1];
    const options = {
      block_id,
      htmlString: transcriptFile.attachment.toString(),
    };

    try {
      const res = await createTranscriptNotion(options);
      if (!res)
        return interaction.editReply(
          "There were no results to save. Please delete this ticket immediately."
        );

      interaction.message.components.forEach((row) => {
        row.components.forEach((component) => {
          if (component.customId == "ticketSaveTranscript")
            component.setDisabled();
        });
      });

      await (interaction.message as Message).edit({
        components: interaction.message.components as MessageActionRow[],
      });

      const url = `https://transcripts.apandas.org/${block_id}`;
      interaction.editReply(`The transcript has been saved\n${url}`);
      try {
        const user = await interaction.client.users.fetch(
          channel.name.split("-")[1]
        );
        user.send(`Here is your ticket transcript:\n${url}`).catch(() => {
          interaction.followUp(
            `${user} was unable to be notified of the transcript. They most likely have DMs disabled.`
          );
        });
        if (user != interaction.user) {
          interaction.followUp({
            content: "You have been notified of the transcript.",
            ephemeral: true,
          });
          await interaction.user.send(`The transcript has been saved\n${url}`);
        }
      } catch (e) {
        await interaction.followUp({
          content:
            "There was an error creating the transcript. Please try again later. If this error persists, please contact the bot owner.",
        });
      }
      ticketLogger.saveTranscript(
        channel.name.split("-")[0],
        url,
        interaction.user,
        await interaction.client.users.fetch(channel.name.split("-")[1])
      );
    } catch (e) {
      console.error(e);
      interaction.followUp({
        content:
          "There was an error creating the transcript. Please try again later. If this error persists, please contact the bot owner.",
        ephemeral: true,
      });
    }
  }
}
