const path = require("path");
const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/middleware");
const bookController = require("../controllers/book.controller");

//  /book/list
router.get("/list", verifyToken, bookController.GET_BOOK_LIST);

//  /book/add
router.post("/add", verifyToken, bookController.ADD_BOOK);

//  /book/1212
router.get("/:id", verifyToken, bookController.GET_SINGLE_BOOK_DETAILS);

//  /book/1212
router.delete("/:id", verifyToken, bookController.DELETE_SINGLE_BOOK);

module.exports = router;
