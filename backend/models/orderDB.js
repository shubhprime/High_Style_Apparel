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

// Declare Order Variable
let Order;

// Initialize and export the Order model asynchronously
export const initOrderModel = async () => {
    const { orderConnection } = await connectDB();
    if (!Order) {
        Order = orderConnection.model("Order", orderSchema);
    }
};

// Function to retrieve the Product model after initialization
export const getOrderModel = () => {
    if (!Order) {
        throw new Error("Order model is not initialized yet. Call initOrderModel first.");
    }
    return Order;
};