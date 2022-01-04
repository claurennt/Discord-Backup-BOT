const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BackupSchema = new Schema({}, { strict: false });
const Backup = mongoose.model("Backup", BackupSchema, "backup");

module.exports = Backup;
