import Quest from '../models/Quest.js';

// @desc    Get all quests
// @route   GET /api/quests
export const getQuests = async (req, res) => {
  try {
    const quests = await Quest.find({}).populate('requiredTasks');
    res.json(quests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a quest
// @route   POST /api/quests
export const createQuest = async (req, res) => {
  try {
    const { user, title, description, requiredTasks, rewardExp, rewardGold, deadline } = req.body;
    
    const quest = new Quest({
      user,
      title,
      description,
      requiredTasks,
      rewardExp,
      rewardGold,
      deadline
    });

    const createdQuest = await quest.save();
    res.status(201).json(createdQuest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
