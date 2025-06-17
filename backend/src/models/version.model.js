const mongoose = require('mongoose');

const versionSchema = new mongoose.Schema({
  pageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Page',
    required: true
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
versionSchema.index({ pageId: 1, createdAt: -1 });

const Version = mongoose.model('Version', versionSchema);

module.exports = Version; 