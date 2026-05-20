const jwt = require("jsonwebtoken");

/**
 * Generate a signed JWT for the given userId
 * @param {string} userId - MongoDB ObjectId of the user
 * @returns {string} Signed JWT token
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });
};

module.exports = generateToken;
