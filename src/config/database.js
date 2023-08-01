// const mysql = require("mysql");

// // Create the connection pool
// const pool = mysql.createPool({
//   connectionLimit: 10, // maximum number of connections
//   host: "localhost", // MySQL host
//   port: 3306,
//   user: "shakib", // MySQL username
//   password: "password", // MySQL password
//   database: "library", // MySQL database name
// });

// // Export the pool
// module.exports = pool;

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("library", "shakib", "password", {
  host: "localhost",
  dialect: "mysql", // Change this to match your database (e.g., "postgres", "sqlite", etc.)
});

module.exports = sequelize;
