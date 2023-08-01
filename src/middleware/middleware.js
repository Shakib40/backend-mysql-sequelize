const jwt = require("jsonwebtoken");
const { secret } = require("../config/config");

// Middleware for token verification
const verifyToken = (request, response, next) => {
  const token =
    request &&
    request.headers &&
    request.headers.authorization &&
    request.headers.authorization.split(" ")[1];

  if (!token) {
    return response.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, secret, (error, decoded) => {
    if (error) {
      return response
        .status(403)
        .json({ message: "Failed to authenticate token" });
    }
    request.userId = decoded.userId;
    next();
  });
};

module.exports = { verifyToken };
