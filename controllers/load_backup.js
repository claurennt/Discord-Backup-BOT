const discordBackup = require("discord-backup");
const backupBot = require("../Discord-backup-BOT/BOTClient.js");

const { DISCORD_SERVER_ID } = process.env;

// controller that loads the backup on the given server
const load_backup = async (req, res) => {
  const myGuild = backupBot.guilds.cache.get(DISCORD_SERVER_ID);

  const { backupId } = req;

  try {
    // try loading the backup, return if it fails
    discordBackup.load(backupId, myGuild).catch((err) => {
      console.log("load error", err);
      return res.status(400).send("Failed to load the Backup.");
    });

    // Print info on the console
    console.log("Loading the Backup...");

    return res
      .status(200)
      .send(
        `<h1>Check your Discord Server! The backup loading process has started!</h1>`
      );
  } catch (err) {
    console.log(err);
  }
};

module.exports = load_backup;
