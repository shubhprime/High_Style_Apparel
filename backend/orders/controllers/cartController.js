import { addItemToCart, clearUserCart, getUserCart, removeItemFromCart, updateItemQuantity } from "../services/cartService.js";

// Add an item to cart service
export const addItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity, amount } = req.body;

        const cartAction = await addItemToCart(userId, productId, quantity, amount);

        res.status(200).json({ success: true, message: "Item added to the cart", cartAction });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const updateCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;

        const cartAction = await updateItemQuantity(userId, productId, quantity);

        res.status(200).json({ success: true, message: "Cart updated", cartAction });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Remove an item from cart service
export const removeItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;

        const cartAction = await removeItemFromCart(userId, productId);

        res.status(200).json({ success: true, message: "Item removed from the cart", cartAction });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Get user's cart service
export const getTheUserCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const cartAction = await getUserCart(userId);

        res.status(200).json({ success: true, message: "User's cart successfully retrieved", cartAction });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Clear user's cart service
export const clearTheUserCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const cartAction = await clearUserCart(userId);

        res.status(200).json({ success: true, message: "User's cart cleared successfully", cartAction });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}