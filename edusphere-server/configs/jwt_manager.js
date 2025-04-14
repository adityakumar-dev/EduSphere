const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION;

const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
}
const refreshToken = (payload) => { 
    return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRATION });
}
const verifyRefreshToken = (token) => {
    return jwt.verify(token, JWT_REFRESH_SECRET);
}
const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
}

module.exports = {
    generateToken,
    refreshToken,
    verifyToken,
    verifyRefreshToken
}