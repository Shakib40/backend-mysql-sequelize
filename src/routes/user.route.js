const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/middleware");

const userController = require("../controllers/user.controller");

// user/list
router.get("/list", verifyToken, userController.GET_USER_LIST);

// user/update/shakib@gmail.com
router.put("/update/:email", verifyToken, userController.UPDATE_USER);

// user/delete
router.delete("/delete/:email", verifyToken, userController.DELETE_USER);

module.exports = router;
