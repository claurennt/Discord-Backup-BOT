const discordBackup = require("discord-backup");
const backupBot = require("../Discord-backup-BOT/BOTClient.js");

const { DISCORD_SERVER_ID } = process.env;

const successLoadingMessage = '🤖: Check your Discord Server! The backup loading process has started!';
const failureLoadingMessage = '🤖: Something went wrong! Error message: ';
// controller that loads the backup on the given server
// eslint-disable-next-line consistent-return

// eslint-disable-next-line consistent-return
const load_backup = (req, res) => {
  const myGuild = backupBot.guilds.cache.get(DISCORD_SERVER_ID);
  const { backupId } = req.foundBackup;
  try {
  // try loading the backup
    discordBackup.load(backupId, myGuild);

    // prints success message and sends response to client
    console.log(successLoadingMessage);
    return res
      .status(200).send(`<h1>${successLoadingMessage}</h1>`);
  } catch (err) {
    // prints failure message and sends response to client
    console.log(`${failureLoadingMessage} ${err}`);
    return res
      .status(400)
      .send(
        `<h1>${failureLoadingMessage} ${err}</h1>`,
      );
  }
};
module.exports = load_backup;