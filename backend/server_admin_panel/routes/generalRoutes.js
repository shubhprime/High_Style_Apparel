import express from 'express';
import { getUserById } from '../../authentication/controllers/userController.js';

const generalRouter = express.Router();

generalRouter.get("/user/:id", getUserById);
generalRouter.get("/dashboard", getDashboardStats);

export default generalRouter; 