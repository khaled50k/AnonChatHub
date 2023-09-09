const express = require("express");
const router = express.Router();
const authController = require("../../controllers/userController");
const authMiddleware = require("../../middleware/validateSession"); // Import your authentication middleware
// Route for user registration
router.post("/register", authController.registerUser);

// Route for user login
router.post("/login", authController.loginUser);

// Add routes for logout, password reset, etc. as needed

module.exports = router;
