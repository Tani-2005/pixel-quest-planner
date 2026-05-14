import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    isCompleted: { type: Boolean, default: false },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
    dueDate: { type: Date },
    rewardExp: { type: Number, default: 10 },
    rewardGold: { type: Number, default: 5 },
  },
  { timestamps: true }
);

export default mongoose.model('Task', taskSchema);
