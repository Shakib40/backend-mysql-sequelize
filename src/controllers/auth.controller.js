const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { verifyToken } = require("../middleware/middleware");
const { secret, expiresIn } = require("../config/config");
const User = require("../models/user.model"); // Import the Sequelize model

router.post("/add", async (request, response) => {
  const { email, password, role } = request.body;

  try {
    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return response.status(400).send({
        message: "Invalid email format",
        status: "FAILED",
      });
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

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return response.status(409).send({
        message: "Email already exists",
        status: "FAILED",
      });
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
    return response.status(500).send({
      message: error.message,
      status: "FAILED",
    });
  }
});

router.post("/login", async (req, response) => {
  const { email, password } = req.body;

  try {
    // Find the user in the database
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return response
        .status(401)
        .json({ message: "Email not found", status: "FAILED" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return response
        .status(401)
        .json({ message: "Password Did not match", status: "FAILED" });
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
    return response.status(500).send({
      message: error.message,
      status: "FAILED",
    });
  }
});

router.get("/users/list", verifyToken, async (request, response) => {
  const { page, limit } = request.query;
  const pageNumber = parseInt(page) || 1;
  const pageSize = parseInt(limit) || 10;
  const startIndex = (pageNumber - 1) * pageSize;

  try {
    // Fetch users with pagination
    const users = await User.findAll({
      offset: startIndex,
      limit: pageSize,
    });

    // Count total number of users
    const totalCount = await User.count();
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
});

// Export the router
module.exports = router;

// Register a new user
// router.post("/add", async (request, response) => {
//   const { email, password } = request.body;

//   // Validate email format
//   const emailRegex = /^\S+@\S+\.\S+$/;
//   if (!emailRegex.test(email)) {
//     return response.status(400).send({
//       message: "Invalid email format",
//       status: "FAILED",
//     });
//   }

//   // Validate password requirements
//   const passwordRegex =
//     /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{6,}$/;
//   if (!passwordRegex.test(password)) {
//     return response.status(400).send({
//       message:
//         "Password should contain at least one uppercase letter, one lowercase letter, one digit, and one special character, and be at least 6 characters long",
//       status: "FAILED",
//     });
//   }

//   // Check if email already exists
//   const checkEmailSQL = "SELECT * FROM users WHERE email = ?";
//   DATABASE.query(checkEmailSQL, [email], async (error, results) => {
//     if (error) {
//       return response.status(500).send({
//         message: error.message,
//         status: "FAILED",
//       });
//     }

//     if (results.length > 0) {
//       return response.status(409).send({
//         message: "Email already exists",
//         status: "FAILED",
//       });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Save the user to the database
//     const insertUserSQL = "INSERT INTO users (email, password) VALUES (?, ?)";
//     DATABASE.query(
//       insertUserSQL,
//       [email, hashedPassword],
//       async (error, results) => {
//         if (error) {
//           return response.status(500).send({
//             message: error.message,
//             status: "FAILED",
//           });
//         }
//         return response.status(200).send({
//           status: "SUCCESS",
//           message: "Added Successfully",
//         });
//       }
//     );
//   });
// });

// Register a new user

// LOGIN Generate a JWT token
// router.post("/login", (req, response) => {
//   const { email, password } = req.body;

//   // Find the user in the database
//   const SQL = "SELECT * FROM users WHERE email = ?";
//   DATABASE.query(SQL, [email], async (error, results) => {
//     if (error) {
//       return response.status(500).send({
//         message: error.message,
//         status: "FAILED",
//       });
//     }

//     if (results.length === 0) {
//       return response
//         .status(401)
//         .json({ message: "Email not found", status: "FAILED" });
//     }

//     const user = results[0];
//     const passwordMatch = await bcrypt.compare(password, user.password);

//     if (!passwordMatch) {
//       return response
//         .status(401)
//         .json({ message: "Password Didnot matched", status: "FAILED" });
//     }

//     // Generate a JWT token
//     const token = jwt.sign({ userId: user.id }, secret, { expiresIn });

//     // Return the token to the client
//     response.status(200).json({
//       token: token,
//       status: "SUCCESS",
//       user: user,
//     });
//   });
// });

// LOGIN Generate a JWT token

// ALL USERS
// router.get("/users/list", verifyToken, (request, response) => {
//   const { page, limit } = request.query;
//   const pageNumber = parseInt(page) || 1;
//   const pageSize = parseInt(limit) || 10;
//   const startIndex = (pageNumber - 1) * pageSize;

//   const SQL = "SELECT * FROM users LIMIT ?, ?";
//   DATABASE.query(SQL, [startIndex, pageSize], (error, results) => {
//     if (error) {
//       return response.status(500).send({
//         message: error.message,
//         status: "FAILED",
//       });
//     }

//     // Count total number of users
//     const countSQL = "SELECT COUNT(*) AS count FROM users";
//     DATABASE.query(countSQL, (error, countResult) => {
//       if (error) {
//         return response.status(500).send({
//           message: error.message,
//           status: "FAILED",
//         });
//       }

//       const totalCount = countResult[0].count;
//       const totalPages = Math.ceil(totalCount / pageSize);

//       return response.status(200).send({
//         status: "SUCCESS",
//         data: results,
//         pagination: {
//           currentPage: pageNumber,
//           pageSize: pageSize,
//           totalCount: totalCount,
//           totalPages: totalPages,
//         },
//       });
//     });
//   });
// });
