const Backup = require("../DB/EmptyModel.js");

// this middleware is used to check the existance of a backup by its id (it has to be a mongoDB ObjectId value)
const findBackupById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const [backupData] = await Backup.find({ _id: id });

    // if the backup is not found return
    if (!backupData)
      return res
        .status(404)
        .send(`<h2> We could not find any backup matching id: ${id}</h2>`);

    // if the backup is found, send it with the request to the next middleware
    req.foundBackup = backupData;

    next();
  } catch (err) {
    console.log(err);
  }
};

module.exports = findBackupById;
