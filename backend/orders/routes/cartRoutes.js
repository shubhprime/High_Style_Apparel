import express from 'express';
import userAuth from '../../authentication/middleware/userAuth.js';
import { addItem, clearTheUserCart, getTheUserCart, removeItem, updateCartItem } from '../controllers/cartController.js';

const cartRouter = express.Router();

// Add an item to cart service
cartRouter.post('/add-to-cart', userAuth, addItem);

// Update item quantity in cart service
cartRouter.put('/update-cart', userAuth, updateCartItem);

// Remove an item from cart service
cartRouter.delete('/remove-from-cart', userAuth, removeItem);

// Get user's cart service
cartRouter.get('/get-cart', userAuth, getTheUserCart);

// Clear user's cart service
cartRouter.delete('/clear-cart', userAuth, clearTheUserCart);

export { cartRouter };