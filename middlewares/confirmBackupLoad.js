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
  terminal: false,
});

/* this middleware is used as an extra layer of safety
before starting with the backup loading process
the process can be started only by typing
a valid confirmation command after being prompted in the terminal */
// eslint-disable-next-line consistent-return
const confirmBackupLoad = (req, res, next) => {
  const { _id, name } = req.foundBackup;

  try {
    // prompt the user recursively for a command to confirm the start of the laoding process
    const promptUserForConfirmation = () => {
      readline.question(
        `🤖: Are you sure you want to load the Backup with id ${_id} on the server ${name} ?
Type the BOT's BACKUP_LOAD_CONFIRMATION_COMMAND to confim:
`,
        // eslint-disable-next-line consistent-return
        (command) => {
          // If the user does not type any command or an invalid command run the function again
          if (!command || command !== BACKUP_LOAD_CONFIRMATION_COMMAND) {
            console.log('🤖: Invalid command.Try again');

            return promptUserForConfirmation();
          }
          // eslint-disable-next-line max-len
          // If the command is correct close the readline interface and proceed to the next middleware
          console.log('🤖: Correct command.Trying to start the backup loading process...');
          readline.close();

          // Send the backipId with the request to the next middleware
          return next();
        },
      );
    };

    promptUserForConfirmation();
  } catch (err) {
    console.log(err);
    return res.send(err);
  }
};

module.exports = confirmBackupLoad;
