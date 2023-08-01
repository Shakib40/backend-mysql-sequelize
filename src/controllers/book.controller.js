const BOOK = require("../models/book.model"); // Import the Sequelize model

exports.GET_BOOK_LIST = async (request, response) => {
  const { page, limit } = request.query;
  const pageNumber = parseInt(page) || 1;
  const pageSize = parseInt(limit) || 10;
  const startIndex = (pageNumber - 1) * pageSize;

  try {
    // Fetch books with pagination
    const books = await BOOK.findAll({
      offset: startIndex,
      limit: pageSize,
    });

    // Count total number of books
    const totalCount = await BOOK.count();
    const totalPages = Math.ceil(totalCount / pageSize);
    return response.status(200).send({
      status: "SUCCESS",
      data: books,
      pagination: {
        currentPage: pageNumber,
        pageSize: pageSize,
        totalCount: totalCount,
        totalPages: totalPages,
      },
    });
  } catch (error) {
    return response.status(500).send({
      message: error.message,
      status: "FAILED",
    });
  }
};

exports.ADD_BOOK = async (request, response) => {
  const {
    title,
    author,
    price,
    total_books_left,
    is_available,
    descriptions,
    category,
    addedBy,
    createdAt,
    updatedAt,
  } = request.body;

  try {
    // Find the book title in the database
    const isBook = await BOOK.findOne({ where: { title } });
    if (isBook) {
      return response
        .status(401)
        .json({ message: "Title already there", status: "FAILED" });
    }

    // Save the book to the database
    const book = await BOOK.create({
      title,
      author,
      price,
      total_books_left,
      is_available,
      descriptions,
      category,
      addedBy,
      createdAt,
      updatedAt,
    });

    return response.status(200).send({
      data: book,
      status: "SUCCESS",
      message: "Added Successfully",
    });
  } catch (error) {
    return response.status(500).send({
      message: error.message,
      status: "FAILED",
    });
  }
};

exports.GET_SINGLE_BOOK_DETAILS = async (request, response) => {
  const id = request.params.id;

  try {
    // Find the book in the database
    const book = await BOOK.findOne({ where: { id } });
    if (!book) {
      return response
        .status(401)
        .json({ message: "Book not found", status: "FAILED" });
    }

    response.status(200).json(book);
  } catch (error) {
    return response.status(500).send({
      message: error.message,
      status: "FAILED",
    });
  }
};

exports.DELETE_SINGLE_BOOK = async (request, response) => {
  const id = request.params.id;

  try {
    // Find the book in the database
    const book = await BOOK.findOne({ where: { id } });
    if (!book) {
      return response
        .status(401)
        .json({ message: "Book not found", status: "FAILED" });
    }

    await book.destroy();

    response.status(200).send({
      book: book,
      status: "SUCCESS",
    });
  } catch (error) {
    return response.status(500).send({
      message: error.message,
      status: "FAILED",
    });
  }
};

// ADD BOOK
// router.post("/add", verifyToken, async (request, response) => {
//   const {
//     title,
//     author,
//     publication_date,
//     price,
//     total_books_left,
//     is_available,
//     descriptions,
//     category,
//   } = request.body;

//   // Validate input data
//   if (!title) {
//     return response.status(400).send({
//       message: "Missing title required fields",
//       status: "FAILED",
//     });
//   }

//   if (!author) {
//     return response.status(400).send({
//       message: "Missing author required fields",
//       status: "FAILED",
//     });
//   }

//   if (!price) {
//     return response.status(400).send({
//       message: "Missing price required fields",
//       status: "FAILED",
//     });
//   }

//   if (!total_books_left) {
//     return response.status(400).send({
//       message: "Missing total_books_left required fields",
//       status: "FAILED",
//     });
//   }

//   if (!descriptions) {
//     return response.status(400).send({
//       message: "Missing descriptions required fields",
//       status: "FAILED",
//     });
//   }

//   if (!category) {
//     return response.status(400).send({
//       message: "Missing category required fields",
//       status: "FAILED",
//     });
//   }

//   // Save the book to the database
//   const insertBookSQL =
//     "INSERT INTO books (title, author, publication_date, price, total_books_left, descriptions, category, is_available) VALUES (?, ?, ?, ?, ?, ?, ?, true)";
//   DATABASE.query(
//     insertBookSQL,
//     [
//       title,
//       author,
//       publication_date,
//       price,
//       total_books_left,
//       descriptions,
//       category,
//       is_available,
//     ],
//     async (error, results) => {
//       if (error) {
//         return response.status(500).send({
//           message: error.message,
//           status: "FAILED",
//         });
//       }
//       return response.status(200).send({
//         status: "SUCCESS",
//         message: "Book added successfully",
//       });
//     }
//   );
// });

// SINGLE DETAILS
// router.get("/:id", verifyToken, async (request, response) => {
//   const bookId = request.params.id;

//   const getBookSQL = "SELECT * FROM books WHERE id = ?";
//   DATABASE.query(getBookSQL, [bookId], (error, results) => {
//     if (error) {
//       return response.status(500).send({
//         message: error.message,
//         status: "FAILED",
//       });
//     }

//     if (results.length === 0) {
//       return response.status(404).send({
//         message: "Book not found",
//         status: "FAILED",
//       });
//     }

//     return response.status(200).send({
//       status: "SUCCESS",
//       data: results[0],
//     });
//   });
// });

// DELETE
// router.delete("/:id", verifyToken, async (request, response) => {
//   const bookId = request.params.id;

//   const deleteBookSQL = "DELETE FROM books WHERE id = ?";
//   DATABASE.query(deleteBookSQL, [bookId], (error, results) => {
//     if (error) {
//       return response.status(500).send({
//         message: error.message,
//         status: "FAILED",
//       });
//     }

//     if (results.affectedRows === 0) {
//       return response.status(404).send({
//         message: "Book not found",
//         status: "FAILED",
//       });
//     }

//     return response.status(200).send({
//       status: "SUCCESS",
//       message: "Book deleted successfully",
//     });
//   });
// });

// Export the router
// module.exports = router;
