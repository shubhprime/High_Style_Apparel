import express from 'express';
import { login, logout, register } from '../controllers/authController.js';
import { initUserModel } from '../../models/userDB.js';

const authRouter = express.Router();

const initializeRoutes = async () => {
  try {
    // Initialize the User model asynchronously
    await initUserModel();
    
    // After successful initialization, define your routes
    authRouter.post('/register', register);
    authRouter.post('/login', login);
    authRouter.post('/logout', logout);

    console.log("User model initialized and routes set up successfully.");
  } catch (error) {
    console.error("Error initializing User model:", error);
  }
};

// Initialize routes when the module is loaded
initializeRoutes();

export { authRouter };
