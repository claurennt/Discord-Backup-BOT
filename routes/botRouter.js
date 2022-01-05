const express = require("express");
const botRouter = express.Router();

const findBackupById = require("../middlewares/findBackupById");
const confirmBackupLoad = require("../middlewares/confirmBackupLoad");
const load_backup = require("../controllers/load_backup.js");

botRouter.get("/", (req, res) => {
  res.send("Welcome to WBS Backup Bot");
});

botRouter.get("/:id", findBackupById, confirmBackupLoad /*load_backup*/);

module.exports = botRouter;
