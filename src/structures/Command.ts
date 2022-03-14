import {
  ApplicationCommandDataResolvable,
  ApplicationCommandPermissionData,
  Client,
  Interaction,
  PermissionResolvable,
} from "discord.js";
import {
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "@discordjs/builders";

export type SlashCommandOptions = {
  requiredPermissions: PermissionResolvable[];
};

export default class SlashCommand {
  metaData:
    | SlashCommandBuilder
    | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
    | SlashCommandSubcommandsOnlyBuilder;
  userPermissions: ApplicationCommandPermissionData[] | undefined;
  defaultPermission: boolean;

  constructor(
    metaData:
      | SlashCommandBuilder
      | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
      | SlashCommandSubcommandsOnlyBuilder,
    userPermissions?: ApplicationCommandPermissionData[] | undefined
  ) {
    this.metaData = metaData;
    this.userPermissions = userPermissions;
    this.defaultPermission = userPermissions == undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async exec(interaction: Interaction) {
    throw new Error("Method not implemented.");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  build(client: Client): ApplicationCommandDataResolvable {
    return {
      ...this.metaData.toJSON(),
      default_permission: this.defaultPermission,
    };
  }
}
