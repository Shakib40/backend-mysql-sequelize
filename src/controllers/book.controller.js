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

exports.UPDATE_SINGLE_BOOK = async (request, response) => {
  const id = request.params.id;
  const {
    title,
    author,
    price,
    total_books_left,
    is_available,
    descriptions,
    category,
  } = request.body;

  try {
    // Find the book in the database
    const book = await BOOK.findOne({ where: { id } });
    if (!book) {
      return response
        .status(401)
        .json({ message: "Book not found", status: "FAILED" });
    }

    // Find the book in the database
    const isTitle = await BOOK.findOne({ where: { title } });
    if (isTitle) {
      return response
        .status(401)
        .json({ message: "Title already present", status: "FAILED" });
    }

    // Get the updated book information from the request body

    // Apply updates to the user object
    book.title = title || book.title; // If title is provided, update it; otherwise, keep the current value
    book.author = author || book.author;
    book.price = price || book.price;
    book.total_books_left = total_books_left || book.total_books_left;
    book.is_available = is_available || book.is_available;
    book.descriptions = descriptions || book.descriptions;
    book.category = category || book.category;
    book.addedBy = book.addedBy;

    // Save the updated user object back to the database
    await book.save();

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
