const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const DATABASE = require("../config/database");
const { verifyToken } = require("../middleware/middleware");

// BOOK LIST
router.get("/list", verifyToken, async (request, response) => {
  const SQL = "SELECT * FROM books";
  DATABASE.query(SQL, (error, results) => {
    if (error) {
      return response.status(500).send({
        message: error.message,
        status: "FAILED",
      });
    }

    return response.status(200).json(results);
  });
});

// ADD BOOK
router.post("/add", verifyToken, async (request, response) => {
  const {
    title,
    author,
    publication_date,
    price,
    total_books_left,
    is_available,
    descriptions,
    category,
  } = request.body;

  // Validate input data
  if (!title) {
    return response.status(400).send({
      message: "Missing title required fields",
      status: "FAILED",
    });
  }

  if (!author) {
    return response.status(400).send({
      message: "Missing author required fields",
      status: "FAILED",
    });
  }

  if (!price) {
    return response.status(400).send({
      message: "Missing price required fields",
      status: "FAILED",
    });
  }

  if (!total_books_left) {
    return response.status(400).send({
      message: "Missing total_books_left required fields",
      status: "FAILED",
    });
  }

  if (!descriptions) {
    return response.status(400).send({
      message: "Missing descriptions required fields",
      status: "FAILED",
    });
  }

  if (!category) {
    return response.status(400).send({
      message: "Missing category required fields",
      status: "FAILED",
    });
  }

  // Save the book to the database
  const insertBookSQL =
    "INSERT INTO books (title, author, publication_date, price, total_books_left, descriptions, category, is_available) VALUES (?, ?, ?, ?, ?, ?, ?, true)";
  DATABASE.query(
    insertBookSQL,
    [
      title,
      author,
      publication_date,
      price,
      total_books_left,
      descriptions,
      category,
      is_available,
    ],
    async (error, results) => {
      if (error) {
        return response.status(500).send({
          message: error.message,
          status: "FAILED",
        });
      }
      return response.status(200).send({
        status: "SUCCESS",
        message: "Book added successfully",
      });
    }
  );
});

// SINGLE DETAILS
router.get("/:id", verifyToken, async (request, response) => {
  const bookId = request.params.id;

  const getBookSQL = "SELECT * FROM books WHERE id = ?";
  DATABASE.query(getBookSQL, [bookId], (error, results) => {
    if (error) {
      return response.status(500).send({
        message: error.message,
        status: "FAILED",
      });
    }

    if (results.length === 0) {
      return response.status(404).send({
        message: "Book not found",
        status: "FAILED",
      });
    }

    return response.status(200).send({
      status: "SUCCESS",
      data: results[0],
    });
  });
});

// DELETE
router.delete("/:id", verifyToken, async (request, response) => {
  const bookId = request.params.id;

  const deleteBookSQL = "DELETE FROM books WHERE id = ?";
  DATABASE.query(deleteBookSQL, [bookId], (error, results) => {
    if (error) {
      return response.status(500).send({
        message: error.message,
        status: "FAILED",
      });
    }

    if (results.affectedRows === 0) {
      return response.status(404).send({
        message: "Book not found",
        status: "FAILED",
      });
    }

    return response.status(200).send({
      status: "SUCCESS",
      message: "Book deleted successfully",
    });
  });
});

// Export the router
module.exports = router;
