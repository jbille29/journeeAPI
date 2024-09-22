const mongoose = require('mongoose');

const EntrySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  journal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Journal',
    required: true,
  },
});

module.exports = mongoose.model('Entry', EntrySchema);
