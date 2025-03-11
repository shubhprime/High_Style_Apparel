import { getCartModel } from "../../models/orderDB.js"

// Add an item to cart service
export const addItemToCart = async(userId, productId, quantity, amount) => {
    if (!userId || !productId || !quantity || !amount) {
        throw new Error("Missing Details");
    }

    if(quantity <= 0) {
        throw new Error("There should be atleast one item");
    }

    if(amount <= 0) {
        throw new Error("Amount should be greater than 0");
    }

    try {
        const Cart = getCartModel();
        let cart = await Cart.findOne({ userId });

        if(!cart) {
            cart = new Cart({ userId, items: [] })
        }

        const itemIndex = cart.items.findIndex( item => item.productId.toString() === productId);
        if(itemIndex > -1){
            cart.items[itemIndex].quantity += quantity;
            cart.items[itemIndex].priceAtAddition = amount;
            cart.items[itemIndex].totalPrice = cart.items[itemIndex].quantity * amount;
        }
        else{
            cart.items.push({ productId, quantity, priceAtAddition: amount, totalPrice: quantity * amount });
        }

        return await cart.save();
    } catch (error) {
        throw new Error(error.message);
    }
}

// Update item quantity in cart service
export const updateItemQuantity = async (userId, productId, quantity) => {
    if (!userId || !productId || quantity === undefined) {
        throw new Error("Missing user, product, or quantity details");
    }

    if (quantity < 0) {
        throw new Error("Quantity cannot be negative");
    }

    const Cart = getCartModel();
    let cart = await Cart.findOne({ userId });

    if (!cart) {
        throw new Error("Cart Not Found");
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

    if (itemIndex === -1) {
        throw new Error("Item not found in cart");
    }

    if (quantity === 0) {
        cart.items.splice(itemIndex, 1);
    } else {
        cart.items[itemIndex].quantity = quantity;
        cart.items[itemIndex].totalPrice = quantity * cart.items[itemIndex].priceAtAddition;
    }

    return await cart.save();
};

// Remove an item from cart service
export const removeItemFromCart = async(userId, productId) => {
    const Cart = getCartModel();
    let cart = await Cart.findOne({ userId });

    if(!cart) {
        throw new Error("Cart Not Found");
    }

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    
    return await cart.save();
}

// Get user's cart service
export const getUserCart = async(userId) => {
    const Cart = getCartModel();
    let cart = await Cart.findOne({ userId })

    if(!cart){
        throw new Error("Cart Not Found");
    }

    return cart;
}

// Clear user's cart service
export const clearUserCart = async(userId) => {
    const Cart = getCartModel();
    let cart = await Cart.findOne({ userId });

    if(!cart){
        throw new Error("Cart Not Found");
    }

    cart.items = [];

    return await cart.save();
}