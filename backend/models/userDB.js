import mongoose from "mongoose";
import { connectDB } from "../config/db.js";

// Define User schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Enter your first name"],
    },
    lastName: {
      type: String,
      required: [true, "Enter your last name"],
    },
    email: {
      type: String,
      required: [true, "Enter your email"],
      unique: [true, "Email must be unique"],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      select: false,
    },
    phone: {
      type: Number,
      required: [true, "Please enter your phone number"],
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationCodeValidation: {
      type: String,
      select: false,
    },
    forgotPasswordCode: {
      type: String,
      select: false,
    },
    forgotPasswordCodeValidation: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// Declare User variable
let User;

// Initialize and export the User model asynchronously
export const initUserModel = async () => {
  const { userConnection } = await connectDB();
  if (!User) {
    User = userConnection.model("User", userSchema);
  }
};

export const getUserModel = () => {
  if (!User) {
    throw new Error("User model is not initialized yet. Call initUserModel first.");
  }
  return User;
};
