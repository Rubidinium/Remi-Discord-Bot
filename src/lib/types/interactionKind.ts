import { CommandInteraction, ButtonInteraction, SelectMenuInteraction, ContextMenuInteraction, MessageComponentInteraction } from "discord.js";

export type InteractionKind = 
		| CommandInteraction 
		| ButtonInteraction 
		| SelectMenuInteraction 
		| ContextMenuInteraction 
		| MessageComponentInteraction;