import express from 'express';
import { getAllProducts } from '../../controllers/productController.js';
import { getAllUsers } from '../../authentication/controllers/userController.js';

const clientRouter = express.Router();

clientRouter.get("/products", getAllProducts)
clientRouter.get("/customers", getAllUsers)


export default clientRouter;