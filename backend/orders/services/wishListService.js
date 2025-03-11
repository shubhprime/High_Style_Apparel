import { getWishListModel } from "../../models/orderDB.js";

// Add item to wishlist
export const addItem = async (userId, productId, amount) => {
    if (!userId || !productId || !amount) {
        throw new Error("Missing Details");
    }

    if (amount < 0) {
        throw new Error("Amount should be greater than or equal to 0");
    }

    try {
        const WishList = getWishListModel();
        let wishList = await WishList.findOne({ userId });

        if (!wishList) {
            wishList = new WishList({ userId, items: [] });
        }

        const itemIndex = wishList.items.findIndex(item => item.productId.toString() === productId);

        if (itemIndex > -1) {
            wishList.items[itemIndex].priceAtAddition = amount;
        }
        else {
            wishList.items.push({
                productId,
                priceAtAddition: amount
            })
        }

        await wishList.save();
        return { message: "Product added to wishlist" };
    } catch (error) {
        throw new Error(error.message);
    }
}

// Remove item from wishlist
export const removeItem = async (userId, productId) => {
    try {
        const WishList = getWishListModel();
        let wishList = await WishList.findOne({ userId });

        if (!wishList) {
            throw new Error("Wishlist not found");
        }

        const initialLength = wishList.items.length;

        wishList.items = wishList.items.filter(item => item.productId.toString() !== productId);

        if (wishList.items.length === initialLength) {
            throw new Error("Product not found in wishlist");
        }

        await wishList.save();
        return { message: "Product removed from wishlist" };
    } catch (error) {
        throw new Error(error.message);
    }
}

// Get the user's wishlist
export const getWishList = async (userId) => {
    try {
        const WishList = getWishListModel();
        let wishList = await WishList.findOne({ userId });

        if (!wishList) {
            return { message: "Wishlist is empty", items: [] };
        }
        return wishList;
    } catch (error) {
        throw new Error(error.message);
    }
}

// Move a single item to the cart
export const moveToCart = async (userId, productId) => {
    try {
        const { addItemToCart } = await import("./cartService.js");
        const WishList = getWishListModel();
        let wishList = await WishList.findOne({ userId });

        if (!wishList) {
            throw new Error("Wishlist not found");
        }

        const itemIndex = wishList.items.findIndex(item => item.productId.toString() === productId);

        if (itemIndex === -1) {
            throw new Error("Product not found in wishlist");
        }

        const product = wishList.items[itemIndex];

        await addItemToCart(userId, productId, 1, product.priceAtAddition);

        wishList.items.splice(itemIndex, 1);
        await wishList.save();
    } catch (error) {
        throw new Error(error.message);
    }
}

// Clears the whole wishlist
export const clearList = async (userId) => {
    try {
        const WishList = getWishListModel();
        let wishList = await WishList.findOne({ userId });

        if (!wishList) {
            throw new Error("Wishlist not found");
        }

        wishList.items = [];

        await wishList.save();
        return { success: true, message: "Wishlist cleared" };
    } catch (error) {
        throw new Error(error.message);
    }
}