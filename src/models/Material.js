import mongoose from 'mongoose';

const MaterialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  courseCode: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Material || mongoose.model('Material', MaterialSchema);