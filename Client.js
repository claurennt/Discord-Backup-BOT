// Load modules

require("dotenv").config();
const { DISCORD_SERVER_ID, BOT_TOKEN } = process.env;

const { Client, Intents } = require("discord.js");
const backup = require("discord-backup");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
const settings = {
  prefix: "bot!",
  token: BOT_TOKEN,
};

client.on("ready", () => {
  console.log(`${client.user.username} is ready!`);
});

client.on("messageCreate", async (message) => {
  // This reads the first part of your message behind your prefix to see which command you want to use.
  let command = message.content
    .toLowerCase()
    .slice(settings.prefix.length)
    .split(" ")[0];

  // These are the arguments behind the commands.
  let args = message.content.split(" ").slice(1);

  // If the message does not start with your prefix return.
  // If the user that types a message is a bot account return.
  // If the command comes from DM return.
  if (
    !message.content.startsWith(settings.prefix) ||
    message.author.bot ||
    !message.guild
  )
    return;

  if (command === "create") {
    // Check member permissions
    if (!message.member.permissions.has("ADMINISTRATOR")) {
      return message.channel.send(
        ":x: | You must be an administrator of this server to request a backup!"
      );
    }
    // Create the backup
    backup
      .create(message.guild, {
        jsonBeautify: true,
      })
      .then((backupData) => {
        // And send informations to the backup owner
        message.author.send(
          `The backup has been created! To load it, type this command on the server of your choice: ${settings.prefix}load ${backupData.id}`
        );
        message.channel.send(
          ":white_check_mark: Backup successfully created. The backup ID was sent in dm!"
        );
      });
  }

  //TODO:send list to the user per dm + more info about that ids
  //   if (command === "list") {
  //     const list = await backup.list();
  //     console.log(list);
  //     return message.channel.send(list.toString());
  //   }

  if (command === "load") {
    // Check member permissions
    if (!message.member.permissions.has("ADMINISTRATOR")) {
      return message.channel.send(
        ":x: | You must be an administrator of this server to load a backup!"
      );
    }

    let backupID = args[0];
    if (!backupID) {
      return message.channel.send(
        ":x: You must specify an ID. Type `bot!list` for more informations."
      );
    } //the backup ids are automatically created and stored. They can be retrieved by typing `bot!`
  }
  // Fetching the backup to know if it exists
  backup
    .fetch(backupID)
    .then(async (backupInfo) => {
      console.log(backupInfo);
      // If the backup exists, request for confirmation
      message.channel.send(
        ":warning: | When the backup is loaded, all the channels, roles, etc. will be replaced! Type `-confirm` to confirm!"
      );
      await message.channel
        .awaitMessages(
          (m) => {
            console.log("mmmmm", m);
            m.author.id === message.author.id && m.content === "-confirm";
          },
          {
            max: 1,
            time: 20000,
            errors: ["time"],
          }
        )
        .catch((err) => {
          // if the author of the commands does not confirm the backup loading
          return message.channel.send(
            ":x: | Time's up! Cancelled backup loading!"
          );
        });
      // When the author of the command has confirmed that he wants to load the backup on his server
      message.author.send(":white_check_mark: | Start loading the backup!");
      // Load the backup
      backup
        .load(backupID, message.guild)
        .then(() => {
          // When the backup is loaded, delete them from the server
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
      return message.channel.send(
        ":x: | No backup found for `" + backupID + "`!"
      );
    });

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
client.login(settings.token);
module.exports = client;
