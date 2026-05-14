import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    username: { type: String, required: true, unique: true },
    avatarUrl: { type: String, default: '' },
    level: { type: Number, default: 1 },
    experience: { type: Number, default: 0 },
    gold: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Profile', profileSchema);
