import express from 'express';
import userAuth from '../../authentication/middleware/userAuth.js';
import { addItemToWishList, clearTheWishList, getUserWishList, moveWishListToCart, removeItemsFromWishList } from '../controllers/wishListController.js';

const wishListRouter = express.Router();

// Add item to wishlist
wishListRouter.post('/add-to-wishlist', userAuth, addItemToWishList);

// Remove item from wishlist
wishListRouter.delete('/remove-item', userAuth, removeItemsFromWishList);

// Get the user's wishlist
wishListRouter.get('/get-wishlist', userAuth, getUserWishList);

// Move a single item to the cart
wishListRouter.post('/move-to-cart', userAuth, moveWishListToCart);

// Clears the whole wishlist
wishListRouter.delete('/clear-wishlist', userAuth, clearTheWishList);

export { wishListRouter };