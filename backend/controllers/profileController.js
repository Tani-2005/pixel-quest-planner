import Profile from '../models/Profile.js';

// @desc    Get user profile
// @route   GET /api/profiles/:userId
export const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.userId });
    if (profile) {
      res.json(profile);
    } else {
      res.status(404).json({ message: 'Profile not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create or update profile
// @route   POST /api/profiles
export const createOrUpdateProfile = async (req, res) => {
  try {
    const { user, username, avatarUrl, level, experience, gold } = req.body;
    
    let profile = await Profile.findOne({ user });

    if (profile) {
      // Update
      profile.username = username || profile.username;
      profile.avatarUrl = avatarUrl || profile.avatarUrl;
      profile.level = level !== undefined ? level : profile.level;
      profile.experience = experience !== undefined ? experience : profile.experience;
      profile.gold = gold !== undefined ? gold : profile.gold;
      
      const updatedProfile = await profile.save();
      return res.json(updatedProfile);
    } else {
      // Create
      profile = new Profile({
        user,
        username,
        avatarUrl,
        level,
        experience,
        gold
      });
      const createdProfile = await profile.save();
      return res.status(201).json(createdProfile);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
