import { Client, Collection, Role } from "discord.js";

export default async function getRoles(client: Client): Promise<Collection<string, Role>> {
	const all = await(await client.guilds.fetch("877584374521008199")).roles.fetch();
	const bottomDiv = all.get("884289615719186442");
	const topDiv = all.get("884289534366470197");
	const courseRoles = all.filter((r: Role) => r.position > (bottomDiv?.position ?? 0) && r.position < (topDiv?.position ?? 69));
	return courseRoles;
}