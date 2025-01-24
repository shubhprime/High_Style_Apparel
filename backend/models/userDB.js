const mongoose = require("mongoose");
const connectDB = require("../db");

// Define User schema
//TO BE REDESIGNED
const userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
    },
    company: String,
    phone: Number,
    query: String,
});

// Create User model
let User;

(async () => {
    const { userConnection } = await connectDB();
    User = userConnection.model("User", userSchema);
})();

module.exports = () => User;
