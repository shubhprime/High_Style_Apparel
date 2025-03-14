import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let userConnection;
let productConnection;
let orderConnection;

// MongoDB connection
export const connectDB = async () => {
  try {
    // Connect to the User database
    if (!userConnection) {
      userConnection = mongoose.createConnection(process.env.MONGODB_URL_USER);
      userConnection.once("open", () => {
        console.log("Connected to the User database");
      });
    }

    // Connect to the Product database
    if (!productConnection) {
      productConnection = mongoose.createConnection(process.env.MONGODB_URL_PRODUCT);
      productConnection.once("open", () => {
        console.log("Connected to the Product database");
      });
    }

    // Connect to the order database
    if (!orderConnection) {
      orderConnection = mongoose.createConnection(process.env.MONGODB_URL_ORDER);
      orderConnection.once("open", () => {
        console.log("Connected to the Orders database");
      })
    }

    return { userConnection, productConnection, orderConnection };
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit the process if there's a connection error
  }
};
