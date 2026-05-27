const jwt = require('jsonwebtoken');
require('dotenv/config');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_in_production_to_strong_secret_32_chars';

function authenticate(req, res, next) {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Authentication required' });

    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

function optionalAuthenticate(req, res, next) {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    if (token) {
      const payload = jwt.verify(token, JWT_SECRET);
      req.user = payload;
    }
  } catch (_) {}
  next();
}

module.exports = { authenticate, optionalAuthenticate };
