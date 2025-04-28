import express from 'express';
import { getAllProducts } from '../../controllers/productController.js';
import { getAllUsers, getGeography } from '../../authentication/controllers/userController.js';
import { getAllUsersOrders } from '../../orders/controllers/orderController.js';

const clientRouter = express.Router();

clientRouter.get("/products", getAllProducts)
clientRouter.get("/customers", getAllUsers)
clientRouter.get("/transactions", getAllUsersOrders)
clientRouter.get("/geography", getGeography)


export default clientRouter;