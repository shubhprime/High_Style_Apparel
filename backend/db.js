const mongoose = require("mongoose");
const dotenv = require('dotenv').config();

// MongoDB connection
const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.MONGODB_URL_USER);
        console.log("Connected to the user database");
    } catch (error) {
        console.error("MongoDB userDB connection error:", error);
        process.exit(1); // Exit the process with an error code
    }
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.MONGODB_URL_PRODUCT);
        console.log("Connected to the product database");
    } catch (error) {
        console.error("MongoDB productDB connection error:", error);
        process.exit(1); // Exit the process with an error code
    }
};

module.exports = connectDB;
