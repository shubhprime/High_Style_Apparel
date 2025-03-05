// Set user roles

import express from 'express';
import userAuth from '../middleware/userAuth.js';
import roleAuth from '../middleware/roleAuth.js';
import { getAllUsers, getUserById } from '../controllers/userController.js';
import { assignAdmin, removeAdmin } from '../controllers/adminController.js';

const levelRouter = express.Router();

// Get all users (Super-Admin only)
levelRouter.get("/", userAuth, roleAuth(["super-admin", "admin"]), getAllUsers);

// Get a specific user by ID (Admin & Super-Admin)
levelRouter.get("/:id", userAuth, roleAuth(["admin", "super-admin"]), getUserById);

// Promote user to admin (Super-Admin only)
levelRouter.put("/promote/:id", userAuth, roleAuth(["super-admin"]), assignAdmin);

// Remove admin role (Super-Admin only)
levelRouter.put("/demote/:id", userAuth, roleAuth(["super-admin"]), removeAdmin);

export default levelRouter;