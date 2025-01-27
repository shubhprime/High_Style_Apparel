import { initializeProductModel, getProductModel } from './models/productDB.js';  // Use ES module imports

(async () => {
    try {
        // Initialize the Product model
        await initializeProductModel();

        // Retrieve the Product model after initialization
        const Product = getProductModel();

        // Sample product data to insert
        const products = [
            {
                productName: "Classic T-Shirt",
                description: "A comfortable and stylish t-shirt.",
                price: {
                    amount: 19.99,
                    currency: "USD",
                },
                category: "Clothing",
                size: ["S", "M", "L", "XL"],
                color: ["Black", "White"],
                stockQuantity: 100,
                imageURL: "https://example.com/images/tshirt.jpg",
            },
            {
                productName: "Denim Jeans",
                description: "Premium quality denim jeans.",
                price: {
                    amount: 49.99,
                    currency: "USD",
                },
                category: "Clothing",
                size: ["28", "30", "32", "34", "36"],
                color: ["Blue", "Black"],
                stockQuantity: 200,
                imageURL: "https://example.com/images/jeans.jpg",
            },
            {
                productName: "Running Shoes",
                description: "Lightweight and durable running shoes.",
                price: {
                    amount: 79.99,
                    currency: "USD",
                },
                category: "Footwear",
                size: ["8", "9", "10", "11", "12"],
                color: ["Red", "Gray", "Blue"],
                stockQuantity: 150,
                imageURL: "https://example.com/images/shoes.jpg",
            },
        ];

        // Insert multiple products into the database
        await Product.insertMany(products);
        console.log("Products added successfully!");

        process.exit(0); // Exit the script
    } catch (error) {
        console.error("Error inserting products:", error);
        process.exit(1); // Exit the script with an error code
    }
})();
