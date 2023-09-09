const User = require("../models/User"); // Import your user model
const Joi = require("joi");
const bcrypt = require("bcrypt");
const userSchema = require("../validation/userSchema");

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

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(value.password, 10);

    // Create a new user using the validated data and hashed password
    const newUser = new User({
      username: value.username,
      email: value.email,
      password: hashedPassword,
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

    res.json({ message: "Login successful", user: req.session.user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
}
module.exports = {
  registerUser,
  loginUser,
  // Add other authentication-related functions here
};
