const crypto = require("crypto");
const getUserModel = require("../../models/userDB");
const sendEmail = require("../utils/sendEmail");

const User = getUserModel();

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        user.forgotPasswordCode = crypto.createHash("sha256").update(resetToken).digest("hex");
        user.save();

        // Send email
        const resetURL = `${req.protocol}://${req.get("host")}/auth/reset-password/${resetToken}`;
        await sendEmail({
            to: user.email,
            subject: "Password Reset",
            text: `Reset your password here: ${resetURL}`,
        });

        res.status(200).json({ message: "Password reset link sent to email" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
