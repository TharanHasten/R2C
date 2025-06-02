const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Check for Authorization header
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Ensure the header starts with 'Bearer '
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Invalid token format. Use Bearer <token>' });
  }

  // Extract token
  const token = authHeader.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Verify JWT_SECRET is set
  if (!process.env.JWT_SECRET) {
    console.error(`[${new Date().toISOString()}] JWT_SECRET is not set in environment variables`);
    return res.status(500).json({ message: 'Server configuration error: JWT_SECRET not set' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id) {
      return res.status(401).json({ message: 'Invalid token: No user ID found in token payload' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Token verification failed:`, error.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;