import express from 'express';
import userAuth from '../authentication/middleware/userAuth.js';
import { getUserData } from '../authentication/controllers/userController.js';
import roleAuth from '../authentication/middleware/roleAuth.js';

const userRouter = express.Router();

userRouter.get('/data', userAuth, roleAuth(["super-admin", "admin"]), getUserData);

export default userRouter;