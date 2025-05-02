import express from 'express';
import { getAdmins } from '../../authentication/controllers/adminController.js';
import { getOrderById } from '../../orders/controllers/orderController.js';

const managementRouter = express.Router();

managementRouter.get("/admins", getAdmins);
managementRouter.get("/performance/:id", getOrderById);

export default managementRouter;