const cron = require("node-cron");

const { DISCORD_SERVER_ID, BOT_TOKEN } = process.env;

//Load modules
const { Client, Intents } = require("discord.js");
const discordBackup = require("discord-backup");

const db = require("../DB/Client.js");
const createAndSaveBackup = require("./utils/createAndSaveBackup.js");

// Discord Bot Client
const backupBot = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
  token: BOT_TOKEN,
});

// Cron Task Setup that runs the createAndSaveBackup function run every day at 7PM
const backupCreateSavingTask = cron.schedule(
  "0 19 1-31 Jan-Dec Mon-Sun ",
  () =>
    createAndSaveBackup(
      discordBackup,
      backupBot,
      db,
      DISCORD_SERVER_ID,
      BOT_TOKEN
    ),
  {
    scheduled: true,
    timezone: "Europe/Busingen",
  }
);

backupBot.once("ready", async () => {
  // Notifies when the bot is connected
  console.log(`${backupBot.user.username} BOT is ready!`);
  try {
    // starts the Cron Task
    backupCreateSavingTask.start();
  } catch (err) {
    console.log(err);
  }
});

//logs the bot in
backupBot.login(BOT_TOKEN);

module.exports = backupBot;