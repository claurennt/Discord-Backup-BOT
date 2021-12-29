require("dotenv").config();
const mongoose = require("mongoose");

const { MONGO_DB_CONNECTION_URI } = process.env;

mongoose
  .connect(MONGO_DB_CONNECTION_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connection to the database successfull"))
  //   catches the error related to establishing connection with the db
  .catch((err) => {
    console.error(err);
    console.log("ERROR! Connection to the database failed");
  });

const db = mongoose.connection;

// catches the error after the connection was successful
db.on("error", (error) => console.log(error.message));

module.exports = db;
