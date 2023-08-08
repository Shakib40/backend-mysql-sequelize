var express = require("express");
const compression = require("compression");
// const cors = require("cors");
const multer = require("multer");
var bodyParser = require("body-parser");
var app = express();
app.use(compression());
// app.use(cors({ origin: "http://localhost:3000", credentials: true }));
const path = require("path");

const sequelizeConnection = require("./src/config/database");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// ROUTES
const authRoutes = require("./src/routes/auth.route");
const userRoutes = require("./src/routes/user.route");
const bookRoutes = require("./src/routes/book.route");

app.use("/", authRoutes);
app.use("/user", userRoutes);
app.use("/book", bookRoutes);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data, status: "FAILED" });
});

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
