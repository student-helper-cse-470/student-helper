import mongoose from 'mongoose';

const TeammatePostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  skills: {
    type: String,
    required: true, // e.g., "MERN Stack, Figma, Python"
  },
  author: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true, // For verification and deletion rights
  },
  contactInfo: {
    type: String,
    required: true, // e.g., Discord username or specific email
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.TeammatePost || mongoose.model('TeammatePost', TeammatePostSchema);