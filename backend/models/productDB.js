const mongoose = require("mongoose");
const connectDB = require("../db");

// Define Product schema
//TO BE REDESIGNED
const productSchema = mongoose.Schema({
    productName: {
        type: String,
        required: true,  // Ensures product name is provided
    },
    description: {
        type: String,
        required: true,  // You can decide whether this is required
    },
    price: {
        amount: {
            type: Number,
            required: true, // Ensures price amount is provided
        },
        currency: {
            type: String,
            enum: ["USD", "EUR", "GBP", "INR", "JPY", "CAD"], // Supported currencies
            default: "USD", // Default currency
        },
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
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

// Create User model
let Product;

(async () => {
    const { productConnection } = await connectDB();
    Product = productConnection.model("Product", productSchema);
})();

module.exports = () => Product;
