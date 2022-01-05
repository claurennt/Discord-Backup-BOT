const discordBackup = require("discord-backup");
const backupBot = require("../Discord-backup-BOT/BOTClient.js");
const Backup = require("../DB/EmptyModel.js");

const { DISCORD_SERVER_ID } = process.env;

const findBackupById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const [backupData] = await Backup.find({ _id: id });

    if (!backupData)
      return res
        .status(404)
        .send(`<h2> We could not find any backup matching id: ${id}</h2>`);

    const { backupId, name } = backupData;

    req.foundBackup = { backupId, name };

    next();
  } catch (err) {
    console.log(err);
  }
};

module.exports = findBackupById;
