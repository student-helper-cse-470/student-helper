import mongoose from 'mongoose';

const AssignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  courseCode: { type: String, required: true },
  dueDate: { type: Date, required: true },
  urgency: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  isCompleted: { type: Boolean, default: false },
  userEmail: { type: String, required: true }, // NEW: Links the assignment to the specific user
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Assignment || mongoose.model('Assignment', AssignmentSchema);