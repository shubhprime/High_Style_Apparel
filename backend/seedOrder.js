import { initOrderModel, getOrderModel } from "./models/orderDB.js";
import { initializeProductModel, getProductModel } from "./models/productDB.js";
import { initUserModel, getUserModel } from "./models/userDB.js";

(async () => {
    try {
        // Initialize models
        await initUserModel();
        await initializeProductModel();
        await initOrderModel();

        // Retrieve models
        const User = getUserModel();
        const Product = getProductModel();
        const Order = getOrderModel();

        // Fetch existing users and products
        const users = await User.find();
        const products = await Product.find();


        if (users.length === 0 || products.length === 0) {
            throw new Error("Users or products collection is empty. Seed them first!");
        }

        // Sample orders
        const orders = [];

        if (users.length > 0 && products.length > 1) {
            orders.push({
                userId: users[0]._id,
                items: [
                    {
                        productId: products[0]._id,
                        quantity: 2,
                        priceAtPurchase: products[0].price.amount,
                    },
                    {
                        productId: products[1]._id,
                        quantity: 1,
                        priceAtPurchase: products[1].price.amount,
                    },
                ],
                totalAmount: products[0].price.amount * 2 + products[1].price.amount,
                status: "Pending",
                paymentMethod: "Credit Card",
                shippingAddress: {
                    house: "123",
                    street: "Main Street",
                    city: "New York",
                    state: "NY",
                    postalCode: "10001",
                    country: "USA",
                },
                phone: 1234567890,
            });
        }

        if (users.length > 1 && products.length > 2) {
            orders.push({
                userId: users[1]._id,
                items: [
                    {
                        productId: products[2]._id,
                        quantity: 3,
                        priceAtPurchase: products[2].price.amount,
                    },
                ],
                totalAmount: products[2].price.amount * 3,
                status: "Shipped",
                paymentMethod: "PayPal",
                shippingAddress: {
                    house: "456",
                    street: "Broadway",
                    city: "Los Angeles",
                    state: "CA",
                    postalCode: "90001",
                    country: "USA",
                },
                phone: 9876543210,
            });
        }

        if (orders.length === 0) {
            throw new Error("Not enough users or products to create sample orders.");
        }

        // Insert orders into the database
        await Order.insertMany(orders);
        console.log("Orders added successfully!");

        process.exit(0);
    } catch (error) {
        console.error("Error inserting orders:", error);
        process.exit(1);
    }
})();
