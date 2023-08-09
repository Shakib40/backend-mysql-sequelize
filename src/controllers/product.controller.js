const PRODUCT = require("../models/product.model"); // Import the Sequelize model

exports.GET_ALL_PRODUCTS = async (request, response, next) => {
  const { page, limit } = request.query;
  const pageNumber = parseInt(page) || 1;
  const pageSize = parseInt(limit) || 10;
  const startIndex = (pageNumber - 1) * pageSize;

  try {
    // Fetch products with pagination
    const products = await PRODUCT.findAll({
      offset: startIndex,
      limit: pageSize,
    });

    // Count total number of products
    const totalCount = await PRODUCT.count();
    const totalPages = Math.ceil(totalCount / pageSize);
    return response.status(200).send({
      status: "SUCCESS",
      data: products,
      pagination: {
        currentPage: pageNumber,
        pageSize: pageSize,
        totalCount: totalCount,
        totalPages: totalPages,
      },
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.ADD_PRODUCT = async (request, response, next) => {
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
    // Find the Product name in the database
    const isProduct = await PRODUCT.findOne({ where: { title } });
    if (isProduct) {
      const error = new Error("Title.");
      error.statusCode = 422;
      throw error;
    }

    // Save the Product to the database
    const product = await PRODUCT.create({
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
      data: product,
      status: "SUCCESS",
      message: "Added Successfully",
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.GET_SINGLE_PRODUCT_DETAILS = async (request, response, next) => {
  const id = request.params.id;

  try {
    // Find the product in the database
    const product = await PRODUCT.findOne({ where: { id } });
    if (!product) {
      const error = new Error("Product could not be found.");
      error.statusCode = 401;
      throw error;
    }

    response.status(200).json(product);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
