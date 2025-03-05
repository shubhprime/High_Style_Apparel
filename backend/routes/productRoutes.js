import express from 'express';
import { getProductModel } from '../models/productDB.js'; // Import the function to get the Product model
import userAuth from '../authentication/middleware/userAuth.js';
import roleAuth from '../authentication/middleware/roleAuth.js';

const router = express.Router();

// Create a new product
router.post("/", userAuth, roleAuth(["super-admin", "admin"]), async (req, res) => {
    try {
        const Product = getProductModel();  // Retrieve the Product model
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(200).json({
            message: "Product successfully added",
            data: newProduct
        });
    } catch (error) {
        console.error("Error saving product:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// Get all products
router.get("/", async (req, res) => {
    try {
        const Product = getProductModel();  // Retrieve the Product model
        const products = await Product.find();
        res.status(200).json({
            message: "Products retrieved successfully",
            data: products
        });
    } catch (error) {
        console.error("Error retrieving products:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// Get a specific product by ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const Product = getProductModel();  // Retrieve the Product model
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({
            message: "Product retrieved successfully",
            data: product
        });
    } catch (error) {
        console.error("Error retrieving product:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// Update a product by ID
router.put("/:id", userAuth, roleAuth(["super-admin", "admin"]), async (req, res) => {
    const { id } = req.params;
    try {
        const Product = getProductModel();  // Retrieve the Product model
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({
            message: "Product updated successfully",
            data: updatedProduct
        });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// Delete a product by ID
router.delete("/:id", userAuth, roleAuth(["super-admin", "admin"]), async (req, res) => {
    const { id } = req.params;
    try {
        const Product = getProductModel();  // Retrieve the Product model
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({
            message: "Product deleted successfully",
            data: deletedProduct
        });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

export default router;
