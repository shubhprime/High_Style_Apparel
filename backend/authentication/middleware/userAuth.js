import jwt from "jsonwebtoken";
import { getUserModel } from "../../models/userDB.js";

const userAuth = async (req, res, next) => {

    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({ success: false, message: 'Not Authorized. Login Again' });
        }


        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        const User = getUserModel();
        const user = await User.findById(tokenDecode.id).select("id role");

        if (!user) {
            return res.status(401).json({ success: false, message: "User not found. Login Again" });
        }

        if (tokenDecode.id) {
            req.user = { id: tokenDecode.id, role: user.role };
        } else {
            return res.status(401).json({ success: false, message: 'Not Authorized. Login Again' });
        }


        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: error.message });
    }
};

export default userAuth;
