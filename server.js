require("dotenv").config();

// Load Bot and DB Clients
require("./DB/Client.js");
require("./Discord-backup-BOT/BOTClient.js");

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const helmet = require("helmet");
const port = 3001;

const botRouter = require("./routes/botRouter");

app.use(helmet());
app.use(logger("dev"));
app.use(express.json());

app.get("/favicon.ico", (req, res) => res.status(204));

app.use("/", botRouter);

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
