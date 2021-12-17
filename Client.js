// Load modules

//check a connection with mongodb
//check now to trigger the backup without message

require("dotenv").config();
const { DISCORD_SERVER_ID, BOT_TOKEN } = process.env;

const { Client, Intents } = require("discord.js");
const backup = require("discord-backup");

// Discord Client
const backupBot = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
  commandPrefix: "bot!",
  token: BOT_TOKEN,
});

const {
  options: { commandPrefix, token },
} = backupBot;

// Notifies when the bot is ready to receive commands
backupBot.on("ready", () => {
  console.log(`${backupBot.user.username} is ready!`);
});

backupBot.on("messageCreate", async (message) => {
  const { content, author, guild, member, channel } = message;

  // Extracts the command from the message
  let command = content.toLowerCase().slice(commandPrefix.length).split(" ")[0];

  // These are the arguments behind the commands.
  let argsAfterCommand = content.split(" ").slice(1);

  // If the message does not start with the commandPrefix return.
  // If the user that types a message is a bot account return.
  // If the command comes from DM return.
  if (!content.startsWith(commandPrefix) || author.bot || !guild) return;

  if (command === "create") {
    // Check if the user who typed the command is an admin.
    if (!member.permissions.has("ADMINISTRATOR")) {
      return channel.send(
        ":x: | You must be an administrator of this server to request a backup!"
      );
    }

    // Create the backup
    backup
      .create(guild, {
        jsonBeautify: true,
      })
      .then((backupData) => {
        const { id } = backupData;
        // Save the backup in a local folder

        // confirm success in the channel
        channel.send(":white_check_mark: Backup successfully created.");

        // And send informations to the backup owner
        author.send(
          "The backup has been created! To load it, type this command on the server of your choice: `" +
            commandPrefix +
            "load " +
            id +
            "`"
        );
      });
  }
  if (command === "load") {
    // Check member permissions
    if (!member.permissions.has("ADMINISTRATOR")) {
      return channel.send(
        ":x: | You must be an administrator of this server to load a backup!"
      );
    }

    let backupID = argsAfterCommand[0];
    if (!backupID) {
      return channel.send(
        ":x: You must specify an ID. You can find the ID in the private message you received or in your local storage folder."
      );
    }

    console.log("bb", backupID);
    //Fetching the backup to know if it exists
    backup
      .fetch(backupID)
      .then(async (backupInfo) => {
        console.log(backupInfo);
        // If the backup exists, request for confirmation

        channel.send(
          ":warning: | When the backup is loaded, all the channels, roles, etc. will be replaced! Type `-confirm` to confirm!",
          2000
        );

        const isCommandCorrect = content.startsWith("-confirm");
        //check if the user who wants to load the backup is the same who typed "-confirm"
        const isUserSame = member.user.id === author.id;
        const condition = isCommandCorrect && isUserSame;
        await channel
          .awaitMessages({
            isCommandCorrect,
            max: 1,
            time: 20000,
            errors: ["time"],
          })
          .catch((err) => {
            console.log(err);
            // if the author of the commands does not confirm the backup loading on time
            return channel.send(":x: | Time's up! Cancelled backup loading!");
          });

        author.send(":white_check_mark: | Start loading the backup!");
        // Load the backup
        console.log("backupid", backupID);
        backup
          .load(backupID, guild)
          .then(() => {
            backup.remove(backupID);
          })
          .catch((err) => {
            // If an error occurred
            return message.author.send(
              ":x: | Sorry, an error occurred... Please check that I have administrator permissions!"
            );
          });
      })
      .catch((err) => {
        console.log(err);
        // if the backup wasn't found
        return channel.send(":x: | No backup found for `" + backupID + "`!");
      });
  }
  if (command === "infos") {
    let backupID = args[0];
    if (!backupID) {
      return message.channel.send(":x: | You must specify a valid backup ID!");
    }
    // Fetch the backup
    backup
      .fetch(backupID)
      .then((backupInfos) => {
        const date = new Date(backupInfos.data.createdTimestamp);
        const yyyy = date.getFullYear().toString(),
          mm = (date.getMonth() + 1).toString(),
          dd = date.getDate().toString();
        const formatedDate = `${yyyy}/${mm[1] ? mm : "0" + mm[0]}/${
          dd[1] ? dd : "0" + dd[0]
        }`;
        let embed = new Discord.MessageEmbed()
          .setAuthor("Backup Informations")
          // Display the backup ID
          .addField("Backup ID", backupInfos.id, false)
          // Displays the server from which this backup comes
          .addField("Server ID", backupInfos.data.guildID, false)
          // Display the size (in mb) of the backup
          .addField("Size", `${backupInfos.size} kb`, false)
          // Display when the backup was created
          .addField("Created at", formatedDate, false)
          .setColor("#FF0000");
        message.channel.send(embed);
      })
      .catch((err) => {
        // if the backup wasn't found
        return message.channel.send(
          ":x: | No backup found for `" + backupID + "`!"
        );
      });
  }
});

//Your secret token to log the bot in. (never share this to anyone!)
backupBot.login(token);

//TODO:send list to the user per dm + more info about that ids
//   if (command === "list") {
//     const list = await backup.list();
//     console.log(list);
//     return message.channel.send(list.toString());
//   }

module.exports = backupBot;
