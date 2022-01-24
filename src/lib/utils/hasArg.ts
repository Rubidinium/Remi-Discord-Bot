export default function hasArg(verbose: string, concise: string) {
	if (process.argv.filter(i => i == "--" + verbose || (i.charAt(0) == "-" && i.charAt(1) != "-" && i.includes(concise))).length > 0) {
		return true;
	}

	return false;
}