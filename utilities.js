const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    console.log('Authorization header:', authHeader);
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        console.log('No token provided');
        return res.sendStatus(401); // Unauthorized
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                console.log('Token has expired');
                return res.status(401).json({ message: 'Token has expired' });
            }
            console.log('Invalid token:', err.message);
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = decoded.user;
        next();
    });
}

module.exports = { authenticateToken };