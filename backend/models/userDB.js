import mongoose from "mongoose";
import { connectDB } from "../db.js";

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
      required: false,
    },
    role: {
      type: String,
      required: true,
      enum: ["user", "admin", "super-admin"],
      default: "user"
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      // select: false,
    },
    verificationCodeExpireAt: {
      type: Number,
      default: 0
    },
    forgotPasswordCode: {
      type: String,
      // select: false,
    },
    forgotPasswordCodeValidation: {
      type: String,
      select: false,
    },
    forgotPasswordCodeExpireAt: {
      type: Number,
      default: 0
    },
    resetSessionToken: {
      type: String,
      select: false, // Ensures it is not fetched unless explicitly requested
    },
    resetSessionStage: {
      type: Number,
      default: 0, // 0 - No session, 1 - OTP sent, 2 - OTP verified
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
