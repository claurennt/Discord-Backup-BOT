//Load modules
const { Client, Intents } = require("discord.js");
const discordBackup = require("discord-backup");
const cron = require("node-cron");

const createAndSaveBackup = require("./utils/createAndSaveBackup.js");

const { DISCORD_SERVER_ID, BOT_TOKEN } = process.env;

// Discord Bot Client
const backupBot = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
  token: BOT_TOKEN,
});

// Cron Task Setup that runs the createAndSaveBackup function every day at 7PM
const backupCreateSaveTask = cron.schedule(
  "0 19 1-31 Jan-Dec Mon-Sun ",
  () => createAndSaveBackup(discordBackup, backupBot, DISCORD_SERVER_ID),
  {
    scheduled: true,
    timezone: "Europe/Berlin",
  }
);

backupBot.once("ready", () => {
  // Notifies when the bot is connected
  console.log(`${backupBot.user.username} BOT is ready!`);
  try {
    // starts the Cron Task
    backupCreateSaveTask.start();
  } catch (err) {
    console.log(err);
  }
});

//logs the bot in
backupBot.login(BOT_TOKEN);

module.exports = backupBot;
