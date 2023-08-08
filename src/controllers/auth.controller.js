const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { secret, expiresIn } = require("../helper/config");
const User = require("../models/user.model"); // Import the Sequelize model

// post
exports.SIGNUP = async (request, response, next) => {
  const { email, password, role = "admin" } = request.body;

  try {
    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      const error = new Error("Invalid email format.");
      error.statusCode = 422;
      throw error;
    }

    // Validate password requirements
    const passwordRegex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{6,}$/;
    if (!passwordRegex.test(password)) {
      const error = new Error(
        "Password should contain at least one uppercase letter, one lowercase letter, one digit, and one special character, and be at least 6 characters long."
      );
      error.statusCode = 422;
      throw error;
    }

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      const error = new Error("Email already exists.");
      error.statusCode = 422;
      throw error;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user to the database
    await User.create({ email, password: hashedPassword, role });

    return response.status(200).send({
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

// post
exports.LOGIN = async (req, response, next) => {
  const { email, password } = req.body;

  try {
    // Find the user in the database
    const user = await User.findOne({ where: { email } });
    if (!user) {
      const error = new Error("A user with this email could not be found.");
      error.statusCode = 401;
      throw error;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      const error = new Error("Wrong password!");
      error.statusCode = 401;
      throw error;
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn });

    // Return the token to the client
    response.status(200).json({
      token: token,
      status: "SUCCESS",
      user: user,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
