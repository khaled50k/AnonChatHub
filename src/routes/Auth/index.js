const express = require("express");
const router = express.Router();
const authController = require("../../controllers/userController");
const authMiddleware = require("../../middleware/validateSession"); // Import your authentication middleware
// Route for user registration
router.post("/register", authController.registerUser);

// Route for user login
router.post("/login", authController.loginUser);
// Request password reset
router.post("/request-reset", authController.requestPasswordReset);
// Reset password
router.post("/reset-password", authController.resetPassword);
// Route to logout
router.post("/logout", authController.logoutUser);

module.exports = router;
