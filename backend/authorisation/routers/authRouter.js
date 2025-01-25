const express = require("express");

// Import controllers
const logInController = require("../controllers/logInController");
const signUpController = require("../controllers/signUpController");
const resetPasswordController = require("../controllers/resetPasswordController");
const forgotPasswordController = require("../controllers/forgotPasswordController");

const router = express.Router();

// User Signup
router.post("/signup", signUpController.signup);

// User Login
router.post("/login", logInController.login);

// Forgot Password
router.post("/forgot-password", forgotPasswordController.forgotPassword);

// Reset Password
router.post("/reset-password", resetPasswordController.resetPassword);

module.exports = router;
