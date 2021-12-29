require("dotenv").config();
const { DISCORD_SERVER_ID, BOT_TOKEN } = process.env;

//Load modules
const { Client, Intents } = require("discord.js");
const backup = require("discord-backup");

const db = require("../DB/Client.js");
const getDateTime = require("../utils/getDateTime.js");

// Discord Client
const backupBot = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
  token: BOT_TOKEN,
});

backupBot.on("ready", async (client) => {
  // Notifies when the bot is connected
  console.log(`${backupBot.user.username} BOT is ready!`);
  try {
    //create backup JSON file
    const backupData = await backup.create(
      client.guilds.cache.get(DISCORD_SERVER_ID),
      {
        jsonBeautify: true,
      }
    );

    const dateTime = getDateTime();

    //expand backup JSON file with current Date and Time and save it in DB
    db.collection("backup").insertOne(
      { ...backupData, dateTime },
      (err, res) => {
        if (err) throw err;
        console.log(
          `Successfully saved the Backup Data in the Database with following _id: ${res.insertedId}`
        );
      }
    );
  } catch (err) {
    console.log(err);
  }
});

//log the bot in
backupBot.login(BOT_TOKEN);

module.exports = backupBot;
