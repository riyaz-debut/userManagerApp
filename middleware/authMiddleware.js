
const jwt = require("jsonwebtoken");

// middleware or authorization
const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, "secretkey");
        req.user = { userId: decoded.userId }; // Ensure userId is parsed as a string
        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid token." });
    }
};

module.exports = authMiddleware;


