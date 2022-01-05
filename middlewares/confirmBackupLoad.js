const { BACKUP_LOAD_CONFIRMATION_COMMAND } = process.env;

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

const confirmBackupLoad = async (req, res, next) => {
  const { backupId, name } = req.foundBackup;

  const answer = await readline.question(
    `Are you sure you want to load the Backup with id ${backupId} on the server ${name}?

Confirm you choice with the BOT's #Confirmation Command: 
    `,
    (command) => {
      if (!command || command != BACKUP_LOAD_CONFIRMATION_COMMAND) {
        console.log(`Invalid command.`);
        return res.status(400).send("Invalid command.");
      }
      console.log(`All right! I am starting the loading process...`);
      readline.close();
    }
  );

  req.backupId = backupId;

  next();
};

module.exports = confirmBackupLoad;
