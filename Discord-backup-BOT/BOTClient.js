//Load modules
const { Client, Intents } = require("discord.js");
const discordBackup = require('discord-backup');
const { CronJob } = require('cron');

const createAndSaveBackup = require("./utils/createAndSaveBackup.js");

const { DISCORD_SERVER_ID, BOT_TOKEN } = process.env;

// Discord Bot Client
const backupBot = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
  token: BOT_TOKEN,
});


// Cron task to save a backup of the server Monday-Suday at 21:00
// ----testing cron job, run every 10 seconds '*/10 * * * * *'
new CronJob('00 21 * * 0-6', () => {
  createAndSaveBackup(discordBackup, backupBot, DISCORD_SERVER_ID);
}, null, true, 'Europe/Berlin');

backupBot.once("ready",  () => {
  // Notifies when the bot is connected
  console.log(`${backupBot.user.username} BOT is ready!`);
  try {
    // starts the Cron Task
 //  backupCreateSaveTask.start();
  } catch (err) {
    console.log(err);
  }
});

//logs the bot in
backupBot.login(BOT_TOKEN);

module.exports = backupBot;
