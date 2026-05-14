import User from '../models/User.js';

// @desc    Register a new user
// @route   POST /api/users
export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // In a real app, hash the password here with bcrypt!
    const user = await User.create({
      email,
      passwordHash: password, 
    });

    res.status(201).json({
      _id: user._id,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user data
// @route   GET /api/users/:id
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.json({
        _id: user._id,
        email: user.email,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
