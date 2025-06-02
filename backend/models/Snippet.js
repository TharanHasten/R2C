const mongoose = require('mongoose');

const snippetSchema = new mongoose.Schema({
  title: { type: String, required: true },
  code: { type: String, required: true },
  language: { type: String, required: true },
  tags: [{ type: String }],
  description: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isPublic: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Snippet', snippetSchema);