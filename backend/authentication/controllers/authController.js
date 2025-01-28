import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getUserModel } from "../../models/userDB.js"; // Ensure this import

export const register = async (req, res) => {
    const { firstName, lastName, email, password, phone } = req.body; // Destructure phone too

    if (!firstName || !email || !password) {
        return res.json({ success: false, message: "Missing Details" });
    }

    try {
        const User = getUserModel(); // Get the initialized User model

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phone,
        });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' }); // Corrected to user._id

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.json({ success: true });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ success: false, message: 'Email and password are required' });
    }

    try {
        const User = getUserModel(); // Get the initialized User model

        const user = await User.findOne({ email }).select('password');

        if (!user) {
            return res.json({ success: false, message: 'Invalid email' });
        }

        // console.log("Stored password:", user.password);
        // console.log("Provided password:", password);
        // console.log(user);


        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' }); // Corrected to user._id

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.json({ success: true });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });

        return res.json({ success: true, message: "Logged Out" });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};
