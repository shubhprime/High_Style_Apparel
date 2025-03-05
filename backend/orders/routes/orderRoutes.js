// Defines order-related API endpoints

import express from 'express';
import userAuth from '../../authentication/middleware/userAuth.js';
import { cancelUserOrder, changeOrderStatus, createNewOrder, getAllOrders, getOrderById } from '../controllers/orderController.js';

const orderRouter = express.Router();

// Create a new order
orderRouter.post('/create-order', userAuth, createNewOrder);
// Get all orders for a user
orderRouter.get('/all-orders', userAuth, getAllOrders);
// Get a single order by order ID
orderRouter.get('/:orderId', userAuth, getOrderById);
// Update order status
orderRouter.put('/update-order-status', userAuth, changeOrderStatus);
// Cancel an order
orderRouter.put('/cancel-order', userAuth, cancelUserOrder);

export { orderRouter };