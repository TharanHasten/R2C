const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {

  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Invalid token format. Use Bearer <token>' });
  }


  const token = authHeader.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  if (!process.env.JWT_SECRET) {
    console.error(`[${new Date().toISOString()}] JWT_SECRET is not set in environment variables`);
    return res.status(500).json({ message: 'Server configuration error: JWT_SECRET not set' });
  }


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