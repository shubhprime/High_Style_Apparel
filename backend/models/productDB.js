import mongoose from "mongoose";
import { connectDB } from "../db.js";  // Corrected to named import

// Define Product schema
const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,  // Ensures product name is provided
    },
    description: {
        type: String,
        required: true,  // You can decide whether this is required
    },
    price: {
        type: {
            amount: {
                type: Number,
                required: true, // Ensures price amount is provided
                default: 0,
            },
            currency: {
                type: String,
                enum: ["USD", "EUR", "GBP", "INR", "JPY", "CAD"], // Supported currencies
                default: "USD", // Default currency,
            },
        },
        required: true,
    },
    category: {
        type: String,  // e.g., shirts, pants, accessories, etc.
        required: true,
    },
    size: [String],  // Array of available sizes (e.g., ['S', 'M', 'L'])
    color: [String],  // Array of available colors (e.g., ['Red', 'Blue'])
    stockQuantity: {
        type: Number,
        required: true,  // Track how many items are in stock
    },
    imageURL: {
        type: String,  // URL to an image of the product (if applicable)
    },
},
    {
        timestamps: true,
    }
);

// Declare Product variable (without initializing immediately)
let Product;

// Initialize the Product model asynchronously after DB connection
export const initializeProductModel = async () => {
    const { productConnection } = await connectDB();  // Await the DB connection
    Product = productConnection.model("Product", productSchema);
};

// Function to retrieve the Product model after initialization
export const getProductModel = () => {
    if (!Product) {
        throw new Error("Product model is not initialized yet. Call initializeProductModel first.");
    }
    return Product;
};
