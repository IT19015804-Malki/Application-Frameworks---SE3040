const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(403).json({ message: 'Access denied. No valid token provided.' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' });
      }
      req.user = user;  // ✅ Set user in request
      next();
    });

  } catch (error) {
    console.error('🚨 Authentication error:', error);
    res.status(500).json({ message: 'Authentication failed', error: error.message });
  }
};

module.exports = { authenticateToken };
