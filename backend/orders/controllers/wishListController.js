import { addItem, clearList, getWishList, moveToCart, removeItem } from "../services/wishListService.js";

// Add item to wishlist
export const addItemToWishList = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, amount } = req.body;

        const wishList = await addItem(userId, productId, amount);

        res.status(200).json({ success: true, message: "Item added to the wishlist", wishList });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Remove item from wishlist
export const removeItemsFromWishList = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;

        const wishList = await removeItem(userId, productId);

        res.status(200).json({ success: true, message: "Item removed from the wishlist", wishList });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Get the user's wishlist
export const getUserWishList = async (req, res) => {
    try {
        const userId = req.user.id;

        const wishList = await getWishList(userId);

        res.status(200).json({ success: true, wishList });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Move a single item to the cart
export const moveWishListToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;

        const wishList = await moveToCart(userId, productId);

        res.status(200).json({ success: true, message: "Item moved to the cart" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Clears the whole wishlist
export const clearTheWishList = async (req, res) => {
    try {
        const userId = req.user.id;

        const wishList = await clearList(userId);

        res.status(200).json({ success: true, message: "All items removed from the wishlist", wishList });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}