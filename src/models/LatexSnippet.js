import mongoose from 'mongoose';

const LatexSnippetSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  latexCode: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true, // Ties the snippet to the user for deletion rights
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.LatexSnippet || mongoose.model('LatexSnippet', LatexSnippetSchema);