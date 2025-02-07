import { getUserModel } from "../../models/userDB.js";

export const getUserData = async (req, res) => {
    try {
        const {userId} = req.body;
        
        const user = await getUserModel().findById(userId);

        if(!user){
            return res.json({success: false, message: 'User not found'});
        }

        res.json({
            success: true,
            userData: {
                name: user.name,
                verified: user.verified
            }
        });
        
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}