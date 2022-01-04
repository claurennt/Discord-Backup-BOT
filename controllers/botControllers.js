const discordBackup = require("discord-backup");
const backupBot = require("../Discord-backup-BOT/BOTClient.js");
const Backup = require("../DB/EmptyModel.js");

const { DISCORD_SERVER_ID } = process.env;

const get_backup_by_id_and_load = async (req, res) => {
  const myGuild = backupBot.guilds.cache.get(DISCORD_SERVER_ID);

  const { id } = req.params;

  try {
    const [backupData] = await Backup.find({ _id: id });

    if (!backupData)
      return res
        .status(404)
        .send(`<h2> We could not find any backup matching id: ${id}</h2>`);

    const { backupId } = backupData;

    // try loading the backup, return if it fails
    discordBackup.load(backupId, myGuild).catch((err) => {
      console.log("laod error", err);
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

module.exports = { get_backup_by_id_and_load };
