const USER = require("../models/user.model"); // Import the Sequelize model

exports.GET_USER_LIST = async (request, response) => {
  const { page, limit } = request.query;
  const pageNumber = parseInt(page) || 1;
  const pageSize = parseInt(limit) || 10;
  const startIndex = (pageNumber - 1) * pageSize;

  try {
    // Fetch users with pagination
    const users = await USER.findAll({
      offset: startIndex,
      limit: pageSize,
    });

    // Count total number of users
    const totalCount = await USER.count();
    const totalPages = Math.ceil(totalCount / pageSize);
    return response.status(200).send({
      status: "SUCCESS",
      data: users,
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

exports.UPDATE_USER = async (request, response) => {
  const email = request.params.email;
  const { password, role } = request.body;

  try {
    // Find the user in the database
    const user = await USER.findOne({ where: { email } });
    if (!user) {
      return response
        .status(401)
        .json({ message: "Email not found", status: "FAILED" });
    }

    // Validate password requirements
    const passwordRegex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{6,}$/;
    if (!passwordRegex.test(password)) {
      return response.status(400).send({
        message:
          "Password should contain at least one uppercase letter, one lowercase letter, one digit, and one special character, and be at least 6 characters long",
        status: "FAILED",
      });
    }

    // Get the updated user information from the request body

    // Apply updates to the user object
    user.password = password || user.password; // If name is provided, update it; otherwise, keep the current value
    user.role = role || user.role;

    // Save the updated user object back to the database
    await user.save();

    response.status(200).send({
      user: user,
      status: "SUCESS",
    });
  } catch (error) {
    return response.status(500).send({
      message: error.message,
      status: "FAILED",
    });
  }
};

exports.DELETE_USER = async (request, response) => {
  const email = request.params.email;
  try {
    // Find the user in the database
    const user = await USER.findOne({ where: { email } });
    if (!user) {
      return response
        .status(401)
        .json({ message: "Email not found", status: "FAILED" });
    }
    await user.destroy();
    response.status(200).send({
      user: user,
      status: "SUCESS",
    });
  } catch (error) {
    return response.status(500).send({
      message: error.message,
      status: "FAILED",
    });
  }
};
