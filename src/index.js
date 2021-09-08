require("dotenv").config();
const { token } = process.env;

const path = require("path");
const { CommandoClient } = require("discord.js-commando");
const { mongoUrl } = process.env,
  { connect, connection } = require("mongoose");
const { MongoGuild, createGuild } = require("./schemas/guild.js");

const banner = require('./commands/misc/banner')

class Mongo {
  constructor(client) {
    this.client = client;

    connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: false,
      poolSize: 5,
      connectTimeoutMS: 10000,
      family: 4,
      useCreateIndex: false,
      useFindAndModify: false,
    });
    //
    connection.on("connected", () => console.log("MongoDB connected"));
    connection.on("disconnected", () =>
      console.log("MongoDB disconnected! - - - - - - - - - - - - -")
    );
    connection.on("err", () =>
      console.log("There was an error connecting to MongoDB")
    );
    //
  }

  async mongoQuery(Schema, method, searchObject, updateObject) {
    try {
      if (method === "getAndUpdate") {
        await Schema.updateMany(searchObject, updateObject, {
          returnDocument: "after",
          upsert: true,
        });
        return await Schema.find(searchObject);
      }
    } catch (err) {
      this.console.error(err?.stack ?? err);
      return err?.stack ?? err;
    }
  }
  //
}

class Gary extends CommandoClient {
  constructor(options) {
    super(options);
    // this.Mongo = {
    //   new: new Mongo(this),
    //   MongoGuild,
    //   getOrMakeGuild: async (id) => {
    //     let guild = await MongoGuild.findOne({ _id: id });
    //     if (!guild) {
    //       const g = await this.guilds.fetch(id);
    //       guild = new MongoGuild(await createGuild(id, g.name));
    //     }
    //     return guild;
    //   },
    // };
  }
}

const client = new Gary({
  owner: "682715516456140838",
  commandPrefix: "-",
});


client.once("ready", async () => {
  console.log("Gary is ready :)")
  client.user.setActivity(`${client.commandPrefix}help`, {
    type: "LISTENING",
  });
  client.registry
    .registerGroups([
      ["misc", "Misc commands"],
      // ["moderation", "Moderation commands"],
    ])
    .registerDefaults()
    .registerCommandsIn(path.join(__dirname, "commands"));
});

client.on("guildMemberAdd", (member) => {
  try {
    member.send(
      `Welcome to Programming Simplified, a bootcamp designed to help beginner programmers learn the necessary basic skills to start their own careers and projects! All new students are automatically placed on a waitlist, and will be notified through DMs once a bootcamp spot opens up.
If you haven't already applied head to https://forms.gle/JeDsAbVitc47Tr9F7`
    );
  } catch (err) {
    console.log(err);
  }
});

client.on('message', banner)

client.login(token);
