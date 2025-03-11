import mongoose from "mongoose";
import { connectDB } from "../db.js";

// Define Orders Schema
const orderSchema = new mongoose.Schema(
    {

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product", // References the Product model
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                },
                priceAtPurchase: {
                    type: Number,
                    required: true
                }
            }
        ],
        totalAmount: {
            type: Number,
            default: 0,
            required: true
        },
        status: {
            type: String,
            enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
            default: "Pending"
        },
        paymentMethod: {
            type: String,
            enum: ["Credit Card", "UPI", "PayPal", "Cash on Delivery"],
            required: true,
            default: "Cash on Delivery"
        },
        shippingAddress: {
            type: {
                house: {
                    type: String,
                    default: "",
                    required: true
                },
                street: {
                    type: String,
                    default: "",
                    required: true
                },
                city: {
                    type: String,
                    default: "",
                    required: true
                },
                state: {
                    type: String,
                    default: "",
                    required: true
                },
                postalCode: {
                    type: String,
                    default: "",
                    required: true
                },
                country: {
                    type: String,
                    default: "",
                    required: true
                },
            },
            required: true
        },
        phone: {
            type: Number,
            required: true
        },
        orderedAt: {
            type: Date,
            default: Date.now, // Auto-set when the order is created
        },
        shippedAt: {
            type: Date,
            default: null,
        },
        deliveredAt: {
            type: Date,
            default: null,
        },
        cancelledAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Define Cart Schema
const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            priceAtAddition: {
                type: Number,
                required: true
            },
            totalPrice: {
                type: Number,
                default: 0,
                required: true
            }
        }
    ],
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Define Wishlist Schema

const wishListSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            priceAtAddition: {
                type: Number,
                required: true
            }
        }
    ],
    updatedAt: { type: Date, default: Date.now }
},
    {
        timestamps: true
    });

// Declare Order Variable
let Order, Cart, WishList;

// Initialize and export the Order model asynchronously
export const initOrderModel = async () => {
    const { initializeProductModel } = await import("../models/productDB.js");
    await initializeProductModel();

    const { orderConnection } = await connectDB();

    if (!Order) {
        Order = orderConnection.model("Order", orderSchema);
        console.log("Order model initialized");
    }
    if (!Cart) {
        Cart = orderConnection.model("Cart", cartSchema);
        console.log("Cart model initialized");
    }
    if (!WishList) {
        WishList = orderConnection.model("WishList", wishListSchema);
        console.log("Wishlist model initialized");
    }
};

// Function to retrieve the Product model after initialization
export const getOrderModel = () => {
    if (!Order) {
        throw new Error("Order model is not initialized yet. Call initOrderModel first.");
    }
    return Order;
};

export const getCartModel = () => {
    if (!Cart) {
        throw new Error("Cart model is not initialized yet. Call initOrderModel first.");
    }
    return Cart;
};

export const getWishListModel = () => {
    if(!WishList) {
        throw new Error("Wishlist model is not initialized yet. Call initOrderModel first.");
    }
    return WishList;
}