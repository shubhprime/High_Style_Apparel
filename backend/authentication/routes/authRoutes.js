import express from 'express';
import { isAuthenticated, login, logout, register, resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail, verifyResetPasswordOtp } from '../controllers/authController.js';
import { initUserModel } from '../../models/userDB.js';
import userAuth from '../middleware/userAuth.js';
import roleAuth from '../middleware/roleAuth.js';

const authRouter = express.Router();

const initializeRoutes = async () => {
  try {
    // Initialize the User model asynchronously
    await initUserModel();
    
    // After successful initialization, define your routes
    authRouter.post('/register', register);
    authRouter.post('/login', login);
    authRouter.post('/logout', userAuth, logout);
    authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp);
    authRouter.post('/verify-account', userAuth, verifyEmail);
    authRouter.post('/is-auth', userAuth, roleAuth(["super-admin", "admin"]), isAuthenticated);
    authRouter.post('/send-reset-otp', userAuth, sendResetOtp);
    authRouter.post('/verify-reset-otp', userAuth, verifyResetPasswordOtp);
    authRouter.post('/reset-password', userAuth, resetPassword);


  } catch (error) {
    console.error("Error initializing User model:", error);
  }
};

// Initialize routes when the module is loaded
initializeRoutes();

export { authRouter };
