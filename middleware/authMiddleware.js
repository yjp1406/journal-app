const jwt = require('jsonwebtoken');
const config = require('../config/config');

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication token missing' });
  }

  jwt.verify(token, config.jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }


    req.user = user;
    next();
  });
};

module.exports = {authenticateToken}