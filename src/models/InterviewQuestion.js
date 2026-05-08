import mongoose from 'mongoose';

const InterviewQuestionSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true, // e.g., "Google", "Local Tech LLC"
  },
  role: {
    type: String,
    required: true, // e.g., "Frontend Intern", "Data Analyst"
  },
  type: {
    type: String,
    enum: ['Technical', 'Behavioral', 'System Design', 'General Experience'],
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.InterviewQuestion || mongoose.model('InterviewQuestion', InterviewQuestionSchema);