const express = require("express");
const botRouter = express.Router();

const {
  get_backup_by_id_and_load,
} = require("../controllers/botControllers.js");

botRouter.get("/", (req, res) => {
  res.send("Welcome to WBS Backup Bot");
});

botRouter.get("/:id", get_backup_by_id_and_load);

module.exports = botRouter;
