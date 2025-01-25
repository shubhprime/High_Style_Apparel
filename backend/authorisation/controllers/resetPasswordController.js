const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const getUserModel = require("../../models/userDB");

const User = getUserModel();

exports.resetPassword = async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;

        // Hash reset token and find user
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        const user = await User.findOne({ forgotPasswordCode: hashedToken });
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Update password
        user.password = await bcrypt.hash(newPassword, 12);
        user.forgotPasswordCode = undefined;
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
