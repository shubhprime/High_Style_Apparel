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

        // API routes
        app.get("/", (req, res) => {
            res.send("Server is running!");
        });

        app.post("/contact", async (req, res) => {
            try {
                const newUser = new User(req.body);
                await newUser.save();
                console.log("Data saved:", newUser);
                res.status(200).json({
                    message: "Data successfully saved",
                    data: newUser
                });
            } catch (error) {
                console.error("Error saving to the database:", error);
                res.status(500).json({ message: "Internal Server Error", error: error.message });
            }
        });

        app.use("/api/products", productRoutes);  // All products routes will now use the productRoutes file        
        app.use('/api/auth', authRouter);
        app.use('/api/user', userRouter);
        
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
