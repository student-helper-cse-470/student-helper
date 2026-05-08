import mongoose from 'mongoose';

const RequirementSchema = new mongoose.Schema({
  name: { type: String, required: true },
  isCompleted: { type: Boolean, default: false }
});

const ProgressSchema = new mongoose.Schema({
  userEmail: { type: String, required: true, unique: true },
  totalCredits: { type: Number, required: true, default: 120 },
  completedCredits: { type: Number, required: true, default: 0 },
  requirements: [RequirementSchema],
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Progress || mongoose.model('Progress', ProgressSchema);