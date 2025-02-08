import express from 'express';
import { isAuthenticated, login, logout, register, resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail } from '../controllers/authController.js';
import { initUserModel } from '../../models/userDB.js';
import userAuth from '../middleware/userAuth.js';

const authRouter = express.Router();

const initializeRoutes = async () => {
  try {
    // Initialize the User model asynchronously
    await initUserModel();
    
    // After successful initialization, define your routes
    authRouter.post('/register', register);
    authRouter.post('/login', login);
    authRouter.post('/logout', logout);
    authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp);
    authRouter.post('/verify-account', userAuth, verifyEmail);
    authRouter.post('/is-auth', userAuth, isAuthenticated);
    authRouter.post('/send-reset-otp', sendResetOtp);
    authRouter.post('/reset-password', resetPassword);


  } catch (error) {
    console.error("Error initializing User model:", error);
  }
};

// Initialize routes when the module is loaded
initializeRoutes();

export { authRouter };
