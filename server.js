var express = require("express");
const compression = require("compression");
const cors = require("cors");
var bodyParser = require("body-parser");
const Sequelize = require("sequelize");

const sequelizeConnection = new Sequelize("library", "shakib", "password", {
  host: "localhost",
  dialect: "mysql", // Specify the dialect (e.g., 'mysql', 'postgres', 'sqlite', 'mssql', etc.)
});
var app = express();
app.use(compression());
app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

sequelizeConnection
  .authenticate()
  .then((conn) => {
    console.log("Connection has been established successfully");
  })
  .catch((error) => {
    console.log("Something went wrong while connecting to database.", error);
  });

// Changes
const BOOK = require("./src/controllers/book.controller");
const AUTH = require("./src/controllers/auth.controller");
app.use("/book", BOOK);
app.use("/", AUTH);

app.listen(5000, () => {
  console.log(`Server running on port 5000`);
});
