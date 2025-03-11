import { getUserModel } from "../../models/userDB.js";

export const getUserData = async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID missing' });
        }
        
        const user = await getUserModel().findById(userId);

        if(!user){
            return res.status(404).json({success: false, message: 'User not found'});
        }

        res.json({
            success: true,
            userData: {
                name: user.name,
                verified: user.verified
            }
        });
        
    } catch (error) {
        res.status(200).json({ success: false, message: error.message });
    }
}

// Get all users (Super-Admin Only)
export const getAllUsers = async (req, res) => {
    try {
        const User = getUserModel();
        const users = await User.find().select("-password"); // Exclude passwords
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get a specific user by ID (Admin & Super-Admin)
export const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const User = getUserModel();
        const user = await User.findById(id).select("-password");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};