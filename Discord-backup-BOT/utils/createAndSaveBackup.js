const getDateTime = require("./getDateTime.js");
const Backup = require("../../DB/EmptyModel.js");

// function that creates a backup of the server and saves it to the database
const createAndSaveBackup = async (backup, client, serverId) => {
  const myGuild = client.guilds.cache.get(serverId);

  //creates backup JSON file
  const backupData = await backup.create(myGuild, {
    jsonBeautify: true,
  });

  const dateTime = getDateTime();

  try {
    //creates backup document in the Backup collection in the DB
    await Backup.create({
      //expand backup JSON file with current Date and Time
      ...backupData,
      dateTime,
      // creates a new property backUpId that will serve as argument for the backup.load() function
      backupId: backupData.id,
    });

    console.log(`Backup saved successfully`);

   
    
    
  } catch (err) {
    console.log("err", err);

   
  }
};

module.exports = createAndSaveBackup;
