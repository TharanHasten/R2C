const User = require('../models/User');
const Snippet = require('../models/Snippet');

const updateProfile = async (req, res) => {
  try {
    const { profile } = req.body;

    if (profile.name && profile.name.length > 50) {
      return res.status(400).json({ message: 'Name must be 50 characters or less' });
    }
    if (profile.bio && profile.bio.length > 500) {
      return res.status(400).json({ message: 'Bio must be 500 characters or less' });
    }
    if (profile.location && profile.location.length > 100) {
      return res.status(400).json({ message: 'Location must be 100 characters or less' });
    }
    if (profile.website && !/^(https?:\/\/)?[\w-]+(\.[\w-]+)+[/#?]?.*$/.test(profile.website)) {
      return res.status(400).json({ message: 'Invalid website URL' });
    }
    if (profile.github && profile.github.length > 100) {
      return res.status(400).json({ message: 'GitHub handle too long' });
    }
    if (profile.twitter && profile.twitter.length > 100) {
      return res.status(400).json({ message: 'Twitter handle too long' });
    }
    if (profile.linkedin && profile.linkedin.length > 100) {
      return res.status(400).json({ message: 'LinkedIn handle too long' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.profile = { ...user.profile, ...profile };
    await user.save();
    res.json(user);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Update profile error:`, error);
    res.status(400).json({ message: 'Server error' });
  }
};

const getDashboard = async (req, res) => {
  try {
    const [user, snippets] = await Promise.all([
      User.findById(req.user.id).select('-password'),
      Snippet.find({ userId: req.user.id }),
    ]);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user, snippets });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Get dashboard error:`, error);
    res.status(400).json({ message: 'Server error' });
  }
};

module.exports = { updateProfile, getDashboard };