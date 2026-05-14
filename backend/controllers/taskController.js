import Task from '../models/Task.js';

// @desc    Get all tasks for a user
// @route   GET /api/tasks
export const getTasks = async (req, res) => {
  try {
    // In a real app, you'd filter by req.user._id (from auth middleware)
    const tasks = await Task.find({});
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a task
// @route   POST /api/tasks
export const createTask = async (req, res) => {
  try {
    const { user, title, description, difficulty, rewardExp, rewardGold, dueDate } = req.body;
    
    const task = new Task({
      user,
      title,
      description,
      difficulty,
      rewardExp,
      rewardGold,
      dueDate
    });

    const createdTask = await task.save();
    res.status(201).json(createdTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a task (e.g., mark completed)
// @route   PUT /api/tasks/:id
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (task) {
      task.title = req.body.title || task.title;
      task.description = req.body.description || task.description;
      task.isCompleted = req.body.isCompleted !== undefined ? req.body.isCompleted : task.isCompleted;
      
      const updatedTask = await task.save();
      res.json(updatedTask);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (task) {
      await task.deleteOne();
      res.json({ message: 'Task removed' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
