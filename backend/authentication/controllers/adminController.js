// Promote and demote users

import { getUserModel } from "../../models/userDB.js";

// Promote a user to Admin (Super-Admin only)
export const assignAdmin = async (req, res) => {
    const { id } = req.params;

    try {
        const User = getUserModel();
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.role === "admin") {
            return res.status(400).json({ success: false, message: "User is already an Admin" });
        }

        if (user.role === "super-admin") {
            return res.status(400).json({ success: false, message: "User is a Super Admin" });
        }

        user.role = "admin";
        await user.save();

        res.status(200).json({ success: true, message: "User promoted to Admin", data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Demote an Admin back to User (Super-Admin only)
export const removeAdmin = async (req, res) => {
    const { id } = req.params;

    try {
        const User = getUserModel();
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.role !== "admin") {
            return res.status(400).json({ success: false, message: "User is not an Admin" });
        }

        user.role = "user";
        await user.save();

        res.status(200).json({ success: true, message: "Admin demoted to User", data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all admins (Super-Admin and admin only)
export const getAdmins = async (req, res) => {
    try {
        const admins = await User.find({ role: { $in: ["admin", "super-admin"] } }).select("-password");
        res.status(200).json(admins);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};