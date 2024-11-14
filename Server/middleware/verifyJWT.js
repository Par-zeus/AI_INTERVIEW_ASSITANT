const jwt = require('jsonwebtoken');
const User = require('../model/user'); // Ensure the correct path to your User model

const verifyJWT = async (req, res, next) => {
    console.log(req);
    console.log(req.headers);
    const authHeader = req.headers.authorization || req.headers.Authorization;
    console.log(authHeader);
    if (!authHeader?.startsWith('Bearer ')) {
        console.log(true);
        return res.status(401).json({ message: 'Unauthorized' }); // Send 401 Unauthorized
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden' }); // Send 403 Forbidden
        }

        try {
            console.log(decoded);
            const user = await User.findOne({ username: decoded.UserInfo.username });
            if (!user) {
                return res.status(404).json({ message: 'User not found' }); // Send 404 Not Found
            }

            req.user = user;
            req.roles = decoded.UserInfo.roles;
            next(); // Proceed to the next middleware or route handler
        } catch (error) {
            return res.status(500).json({ message: 'Server error', error: error.message });
        }
    });
};

module.exports = verifyJWT;
