const discordBackup = require("discord-backup");
const backupBot = require("../Discord-backup-BOT/BOTClient.js");
const db = require("../DB/Client.js");

const get_backup_by_id_and_load = async (req, res) => {
  const { token } = backupBot;
  const { id } = req.params.id;

  const backupData = await db.collection("backup").findOne({ _id: id });

  if (!backupData)
    return res
      .status(404)
      .send(`We could not find any backup matching id:${id}`);
  try {
    discordBackup
      .load(backupData._id, backupBot.guilds.cache.get(token))
      .then(() => {
        console.log("test");
        discordBackup.remove(backupID); // When the backup is loaded, it's recommended to delete it
        return res.status(200).send("Backup loaded successfully");
      });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { get_backup_by_id_and_load };
