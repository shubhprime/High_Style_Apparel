import { getProductModel } from "../models/productDB.js";

export const createProduct = async (req, res) => {
    try {
        const Product = getProductModel();
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
};

export const getAllProducts = async (req, res) => {
    try {
        const Product = getProductModel();
        const products = await Product.find();
        res.status(200).json({
            message: "Products retrieved successfully",
            data: products
        });
    } catch (error) {
        console.error("Error retrieving products:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const Product = getProductModel();
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
};

export const updateProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const Product = getProductModel();
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
};

export const deleteProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const Product = getProductModel();
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
};
