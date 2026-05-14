import mongoose from 'mongoose';

const questSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['active', 'completed', 'failed'], default: 'active' },
    requiredTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    rewardExp: { type: Number, default: 50 },
    rewardGold: { type: Number, default: 20 },
    deadline: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model('Quest', questSchema);
