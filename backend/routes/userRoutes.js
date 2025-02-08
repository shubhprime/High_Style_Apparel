import express from 'express';
import userAuth from '../authentication/middleware/userAuth.js';
import { getUserData } from '../authentication/controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/data', userAuth, getUserData);

export default userRouter;