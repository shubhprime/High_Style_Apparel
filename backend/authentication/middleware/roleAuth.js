const roleAuth = (roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ success: false, message: "Unauthorized" });
    }
    next();
};

export default roleAuth;
