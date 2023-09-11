# AnonChatHub

AnonChatHub is a secure and anonymous chat application that allows users to communicate privately. It employs encryption to ensure message privacy and offers real-time notifications when new messages arrive.

## Technologies Used

- **Node.js:** A JavaScript runtime for building the server-side of the application.
- **Express.js:** A web application framework for handling routes and server logic.
- **MongoDB:** A NoSQL database used for storing user information and messages.
- **Mongoose:** An ODM (Object Data Modeling) library for MongoDB.
<!-- - **Socket.io:** A library for enabling real-time, bidirectional communication between clients and the server. -->
- **Bcrypt:** A library for hashing user passwords before storing them.
- **Nodemailer:** A library for sending email notifications, such as password reset emails.
- **Express Sessions:** Middleware for managing user sessions.
- **Express Rate Limit:** Middleware for limiting the number of requests per IP.
- **Helmet:** Middleware for adding security HTTP headers.
- **Joi:** A library for request body validation.
- **Winston:** A logging library for error handling and debugging.
- **Dotenv:** A library for loading environment variables from a `.env` file.
- **Cors:** Middleware for enabling Cross-Origin Resource Sharing.
- **Express Mongo Sanitize:** Middleware for sanitizing input to prevent MongoDB injection.
- **Express XSS Sanitizer:** Middleware for sanitizing user input to prevent XSS attacks.

## Features

- **User Registration:** Users can create accounts with a unique decryption key.
- **User Authentication:** Secure login system with password hashing.
- **Password Reset:** Allows users to reset their passwords via email.
- **Anonymous Messaging:** Users can send and receive anonymous messages.
<!-- - **Real-time Notifications:** Instantly notifies users of new messages using Socket.io. -->
- **Message Encryption:** Messages are encrypted to ensure privacy.
- **Rate Limiting:** Protects against abuse with rate limiting.
- **Security Headers:** Implements security headers for improved security.
- **Logging:** Utilizes Winston for logging and error handling.
- **Validation:** Uses Joi for input validation.
- **MongoDB Integration:** Stores user data and messages in a MongoDB database.

## Published Documentation on Postman

Explore and test the ChatAnonHub API with our comprehensive Postman documentation. Whether you're a developer looking to integrate our chat application into your project or simply curious about how it works, this documentation provides detailed examples and endpoints for your convenience.

[![Postman Documentation](https://documenter.getpostman.com/view/24527103/2s9YC1Xuon)](https://documenter.getpostman.com/view/24527103/2s9YC1Xuon)

Click the link above to access the ChatAnonHub API documentation on Postman. It's your gateway to understanding and utilizing the various features and functionalities our secure and anonymous chat platform has to offer.
