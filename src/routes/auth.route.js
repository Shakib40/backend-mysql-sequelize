const path = require("path");
const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");

router.post("/add", authController.SIGNUP); //  /add
router.post("/login", authController.LOGIN); // /login

module.exports = router;
