const express = require('express');
const router = express.Router();
const { updateProfile, getDashboard } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);
router.put('/profile', updateProfile);
router.get('/dashboard', getDashboard);

module.exports = router;