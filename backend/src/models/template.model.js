const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  icon: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['meeting', 'wiki', 'spec', 'techdoc', 'roadmap'],
    required: true
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
}, {
  timestamps: true
});

// Ensure unique template types
templateSchema.index({ type: 1 }, { unique: true });

const Template = mongoose.model('Template', templateSchema);

module.exports = Template; 