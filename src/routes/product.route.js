const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/verifyToken");

const productController = require("../controllers/product.controller");

// product/list
router.get("/list", verifyToken, productController.GET_ALL_PRODUCTS);

// product/add
router.post("/add", verifyToken, productController.ADD_PRODUCT);

// product/add
router.get("/:id", verifyToken, productController.GET_SINGLE_PRODUCT_DETAILS);

module.exports = router;
