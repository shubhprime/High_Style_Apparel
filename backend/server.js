const express = require("express");
const cors = require("cors");
const dotenv = require('dotenv').config();
const connectDB = require("./db");
const User = require("./models/userDB");
const Product = require("./models/productDB");
const productRoutes = require("./routes/productRoutes");
const authRouter = require("./authorisation/routers/authRouter");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 8080;

// Connect to MongoDB
connectDB();

//MAY NEED NAME CHANGE
const frontendPath = path.join(__dirname, "../frontend/build");
app.use(express.static(frontendPath));

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

app.use("/products", productRoutes);  // All /products routes will now use the productRoutes file
app.use("/api/auth", authRouter);  // Use auth routes


app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

// Start the server
app.listen(PORT, () =>
    console.log(`Server is listening at port ${PORT}`)
);
