const getDateTime = require("./getDateTime.js");

// function that creates a backup of the server and saves it to the database
const createAndSaveBackup = async (backup, client, db, serverId) => {
  //creates backup JSON file
  const backupData = await backup.create(client.guilds.cache.get(serverId), {
    jsonBeautify: true,
  });

  const dateTime = getDateTime();

  //expand backup JSON file with current Date and Time and save it in DB
  db.collection("backup").insertOne({ ...backupData, dateTime }, (err, res) => {
    if (err) throw err;
    console.log(
      `Successfully saved the Backup Data in the Database with following _id: ${res.insertedId}`
    );
  });
};

module.exports = createAndSaveBackup;
