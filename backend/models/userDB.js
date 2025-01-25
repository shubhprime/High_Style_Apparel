const mongoose = require("mongoose");
const connectDB = require("../db");
const { required, boolean, bool } = require("joi");

// Define User schema
//TO BE REDESIGNED
const userSchema = mongoose.Schema({
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
    company: String,
    phone: {
        type: Number,
        required: [true, "Please enter your phone number"],
    },
    query: String,
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
}, {
    timestamps: true
});

// Create User model
let User;

const initUserModel = async () => {
    const { userConnection } = await connectDB();
    User = userConnection.model("User", userSchema);
};

// Export the User model directly after initializing it
module.exports = {
    initUserModel,
    User: () => User,
};