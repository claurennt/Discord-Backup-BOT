const {
  env: { BACKUP_LOAD_CONFIRMATION_COMMAND },
  stdin,
  stdout,
} = process;

/* use Node's readline module and configure its interface to listen for the user's input from process.stdin 
and write the output to process.stdout */
const readline = require("readline").createInterface({
  input: stdin,
  output: stdout,
});

/* this middleware is used as an extra layer of safety before starting with the backup loading process
 the process can be started only by typing a valid confirmation command after being prompted in the terminal*/
const confirmBackupLoad = (req, res, next) => {
  const { backupId, name } = req.foundBackup;

  try {
    // prompt the user for a command to confirm the start of the laoding process
    readline.question(
      `Are you sure you want to load the Backup with id ${backupId}
on the server ${name}?
Confirm you choice with the BOT's #Confirmation Command: 
`,
      (command) => {
        // If the user does not type any command or an invalid command return
        if (!command || command !== BACKUP_LOAD_CONFIRMATION_COMMAND) {
          console.log("Invalid command.");
          return res.status(400).send(`<h2>Invalid command.</h2>`);
        }
        // If the command is correct close the readline interface and proceed to the next middleware
        console.log(`All right! I am starting the loading process...`);
        readline.close();

        // Send the backipId with the request to the next middleware
        req.backupId = backupId;

        next();
      }
    );
  } catch (err) {
    console.log(err);
  }
};

module.exports = confirmBackupLoad;
