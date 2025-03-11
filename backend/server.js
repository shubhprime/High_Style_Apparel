import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db.js';
import { initUserModel } from './models/userDB.js';
import { initializeProductModel, getProductModel } from './models/productDB.js'; // Use the correct exports
import productRoutes from './routes/productRoutes.js';
import { authRouter } from './authentication/routes/authRoutes.js';
import path from 'path';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import userRouter from './routes/userRoutes.js';
import { orderRouter } from './orders/routes/orderRoutes.js';
import { initOrderModel } from './models/orderDB.js';
import levelRouter from './authentication/routes/userRoutes.js';
import { cartRouter } from './orders/routes/cartRoutes.js';
import { wishListRouter } from './orders/routes/wishListRoutes.js';

// Load environment variables
dotenv.config();

// Get the filename and directory path equivalent of __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true }));
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 8080;

// MongoDB connection and model initialization
const initializeApp = async () => {
    try {
        // Connect to MongoDB
        await connectDB();
        console.log("Connected to MongoDB");

        // Initialize User model
        await initUserModel();
        console.log("User model initialized");

        // Initialize Product model
        await initializeProductModel();  // Ensure Product model is initialized
        const Product = getProductModel();  // Get the Product model after initialization
        console.log("Product model initialized");

        // Initialize Order model
        await initOrderModel();
        console.log("Order model initialized");

        // API routes
        app.get("/", (req, res) => {
            res.send("Server is running!");
        });

        app.use("/api/product", productRoutes);  // All products routes will now use the productRoutes file        
        app.use('/api/auth', authRouter); // All authentication routes will now use the authRoutes file
        app.use('/api/user', userRouter); // All user routes will now use the userRoutes file
        app.use('/api/order', orderRouter); // All order routes will now use the orderRoutes file
        app.use('/api/user-level', levelRouter); // All order routes will now use the levelRoutes file
        app.use('/api/cart', cartRouter); // All order routes will now use the cartRoutes file
        app.use('/api/wishlist', wishListRouter); // All wishlist routes will now use the wishListRoutes file


        // Start the server
        app.listen(PORT, () => {
            console.log(`Server is listening at port ${PORT}`);
        });
    } catch (error) {
        console.error("Error during server initialization:", error);
    }
};

// Initialize and start the app
initializeApp();
