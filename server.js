var express = require("express");
const compression = require("compression");
const cors = require("cors");
var bodyParser = require("body-parser");
const sequelizeConnection = require("./src/config/database");

var app = express();
app.use(compression());
app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Changes
const BOOK = require("./src/controllers/book.controller");
const AUTH = require("./src/controllers/auth.controller");
app.use("/book", BOOK);
app.use("/", AUTH);

sequelizeConnection
  .sync()
  .then((response) => {
    app.listen(5000, () => {
      console.log(`Server running on port 5000`);
    });
  })
  .catch((error) => {
    console.log("Something went wrong while connecting to database.", error);
  });
