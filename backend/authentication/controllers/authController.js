import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { getUserModel } from "../../models/userDB.js"; // Ensure this import
import transporter from '../../config/nodemailer.js';

export const register = async (req, res) => {
    const { firstName, lastName, email, password, phone, homeAddress } = req.body; // Destructure phone too

    if (!firstName || !email || !password || !homeAddress) {
        return res.status(400).json({ success: false, message: "Missing Details" });
    }

    // Validate homeAddress fields
    const requiredFields = ['house', 'street', 'city', 'state', 'postalCode', 'country'];
    const missingFields = requiredFields.filter(field => !homeAddress[field]);

    if (missingFields.length > 0) {
        return res.status(400).json({ success: false, message: `Missing address fields: ${missingFields.join(", ")}` });
    }

    try {
        const User = getUserModel(); // Get the initialized User model

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phone,
            homeAddress,
        });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '3h' }); // Corrected to user._id

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 3 * 60 * 60 * 1000,
        });

        //Email to user upon registration
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to High Style Apparel',
            text: `Welcome to High Style Apparel, the land of fashion. Your account has been successfully created with the email id: ${email}`
        }

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ success: true, message: "Registration successful", userId: user._id });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    try {
        const User = getUserModel(); // Get the initialized User model

        const user = await User.findOne({ email }).select('password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'Invalid credentials' });
        }

        // console.log("Stored password:", user.password);
        // console.log("Provided password:", password);
        // console.log(user);


        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '3h' }); // Corrected to user._id

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({ success: true, message: "Login successful", userId: user._id });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });

        return res.status(200).json({ success: true, message: "Logged Out" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


// Send Verification code to the user's email
export const sendVerifyOtp = async (req, res) => {
    try {
        const userId = req.user?.id;

        const user = await getUserModel().findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.verified) {
            return res.status(400).json({ success: false, message: "Account Already Verified" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verificationCode = otp;
        user.verificationCodeExpireAt = Date.now() + (1 * 60 * 60 * 1000);

        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification OTP',
            text: `Your OTP(One-Time Password) is ${otp}.
            Verify your account using this OTP.`
        }
        await transporter.sendMail(mailOption);

        return res.status(200).json({ success: true, message: 'Verification OTP sent on Email' });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const verifyEmail = async (req, res) => {
    const { otp } = req.body;
    const userId = req.user?.id;

    if (!userId || !otp) {
        return res.status(400).json({ success: false, message: 'Missing Details' });
    }

    try {

        const User = getUserModel();
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }


        if (user.verificationCode === '' || user.verificationCode !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        if (user.verificationCodeExpireAt < Date.now()) {
            return res.status(400).json({ success: false, message: 'OTP Expired' });
        }

        user.verified = true;
        user.verificationCode = '';
        user.verificationCodeExpireAt = 0;

        await user.save();
        return res.status(200).json({ success: true, message: 'Email Verified Successfully' })

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

// Check if user is authenticated
export const isAuthenticated = async (req, res) => {
    try {
        return res.status(200).json({ success: true, message: "User is authenticated" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

// Send Password Reset OTP
export const sendResetOtp = async (req, res) => {

    const {email} = req.body;

    if(!email){
        return res.status(400).json({ success: false, message: "Email is required" });
    }

    try {

        const user = await getUserModel().findOne({ email });
        if(!user){
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        const sessionId = crypto.randomBytes(32).toString('hex'); // Generate session token

        user.forgotPasswordCode = otp;
        user.forgotPasswordCodeExpireAt = Date.now() + (15 * 60 * 1000);
        user.sessionId = sessionId; // Store session ID in DB
        user.resetSessionStage = 1; // Mark stage


        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP',
            text: `Your OTP(One-Time Password) for resetting your password is ${otp}.
            Use this OTP to proceed with resetting your password.`
        };

        await transporter.sendMail(mailOption);

        res.status(200).json({ success: true, message: 'Password Reset OTP sent on Email', sessionId });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const verifyResetPasswordOtp = async (req, res) => {
    const { otp, sessionId } = req.body;

    if (!sessionId || !otp) {
        return res.status(400).json({ success: false, message: 'OTP and sessionId are required' });
    }

    try {
        const user = await getUserModel().findOne({ sessionId });

        if (!user) {
            return res.status(404).json({ success: false, message: "Invalid session or user not found" });
        }

        if (user.forgotPasswordCodeExpireAt < Date.now()) {
            return res.status(400).json({ success: false, message: 'OTP expired' });
        }

        if (!user.forgotPasswordCode || user.forgotPasswordCode !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        // OTP is valid, clear it and generate a temporary reset token
        user.forgotPasswordCode = "";
        user.forgotPasswordCodeExpireAt = 0;
        user.resetSessionStage = 2;
        user.isOtpVerified = true;
        await user.save();

        return res.status(200).json({ success: true, message: 'OTP verified successfully' });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Reset User Password
export const resetPassword = async (req, res) => {
    const { newPassword, sessionId } = req.body;

    if (!sessionId || !newPassword) {
        return res.status(400).json({ success: false, message: 'New password and sessionId are required' });
    }

    try {
        const user = await getUserModel().findOne({ sessionId });

        if (!user || user.resetSessionStage !== 2 || !user.isOtpVerified) {
            return res.status(404).json({ success: false, message: "Invalid OTP" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);
        user.password = hashedPassword;

        user.sessionId = ""; // Clear session ID
        user.resetSessionStage = 0;
        user.isOtpVerified = false;
        
        await user.save();

        return res.status(200).json({ success: true, message: 'Password has been reset successfully' });

    } catch (error) {
        return res.status(500).json({ success: false, message: 'Invalid or expired reset token' });
    }
};