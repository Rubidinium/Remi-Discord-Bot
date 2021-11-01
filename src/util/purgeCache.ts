import { Collection } from "discord.js";
import { _RATE_LIMIT_TIME } from "../server";
export default function purgeCache(cache: Collection<string, number>): Collection<string, number> {
	return cache.filter(i => new Date().getTime() - i < _RATE_LIMIT_TIME);
}