const User = require("../models/User"); // Import your user model
const Joi = require("joi");
const bcrypt = require("bcrypt");
const crypto = require("crypto"); // Import the crypto module
const userSchema = require("../validation/userSchema");
const { generateResetToken, sendResetEmail } = require("../utils/email"); // Make sure to adjust the path
// Request password reset

async function requestPasswordReset(req, res) {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate reset token
    const resetToken = generateResetToken();

    // Store reset token and expiration timestamp in user document
    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000; // Token valid for 1 hour
    await user.save();

    // Send reset email
    await sendResetEmail(email, resetToken);

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
}

async function resetPassword(req, res) {
  try {
    const { resetToken, newPassword } = req.body;

    // Find user by reset token and check if it's valid and not expired
    const user = await User.findOne({
      resetToken,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }
    // Additional validation for new password
    if (!newPassword || newPassword.trim().length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters" });
    }

    // Update user's password and clear reset token
    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
}

// Controller for user registration
async function registerUser(req, res) {
  try {
    // Validate user registration input
    const { error, value } = userSchema.validate(req.body);

    // Check for validation errors
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Check if the email is already registered
    const existingUser = await User.findOne({ email: value.email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    // Generate a unique decryption key for the user
    const decryptionKey = crypto.randomBytes(32).toString("hex");

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(value.password, 10);

    // Create a new user using the validated data, hashed password, and decryption key
    const newUser = new User({
      username: value.username,
      email: value.email,
      password: hashedPassword,
      decryptionKey: decryptionKey, // Store the decryption key
      // Add other user properties here
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "User registration failed" });
  }
}

// Controller for user login
async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    // Find the user by their email
    const user = await User.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Store user data in the session (excluding sensitive information)
    req.session.user = {
      _id: user._id,
      username: user.username,
      // Add other non-sensitive user properties here
    };
    req.session.authenticated = true;
    res.json({ message: "Login successful", user: req.session.user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
}

// Controller for user logout
function logoutUser(req, res) {
  try {
    // Destroy the user's session
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Logout failed" });
      }

      // Redirect the user to the login page or any other appropriate action
      res.redirect("/login"); // Replace with your desired redirect URL
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Logout failed" });
  }
}

module.exports = {
  registerUser,
  loginUser,
  resetPassword,
  requestPasswordReset,
  logoutUser,
  // Add other authentication-related functions here
};
