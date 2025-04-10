import express from "express";
import userAuth from "../authentication/middleware/userAuth.js";
import roleAuth from "../authentication/middleware/roleAuth.js";
import { createProduct, getAllProducts, getProductById, updateProductById, deleteProductById } from "../controllers/productController.js";

const router = express.Router();

// Routes
router.post("/", userAuth, roleAuth(["super-admin", "admin"]), createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.put("/:id", userAuth, roleAuth(["super-admin", "admin"]), updateProductById);
router.delete("/:id", userAuth, roleAuth(["super-admin", "admin"]), deleteProductById);

export default router;
