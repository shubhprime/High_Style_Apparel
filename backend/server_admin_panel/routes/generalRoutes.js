import express from 'express';
import { getUserById } from '../../authentication/controllers/userController.js';

const generalRouter = express.Router();

generalRouter.get("/:id", getUserById)

export default generalRouter; 