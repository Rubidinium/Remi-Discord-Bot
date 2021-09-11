const Commando = require("discord.js-commando");

module.exports = class RevisionCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: "revision",
            group: "misc",
            memberName: "revision",
            description: "gets the git revision of the bot",
        });
    }
    async run(message, args) {
        if (!message.member.hasPermission('ATTACH_FILES')) return;
        revision = require('child_process')
            .execSync('git rev-parse HEAD')
            .toString().trim()
        message.reply(`Commit ${revision}`)
    }
}