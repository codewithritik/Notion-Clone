const mongoose = require('mongoose');

const workspaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['owner', 'editor', 'viewer'],
      default: 'viewer'
    }
  }]
}, {
  timestamps: true
});

// Ensure creator is added as owner
workspaceSchema.pre('save', function(next) {
  if (this.isNew) {
    this.members.push({
      userId: this.createdBy,
      role: 'owner'
    });
  }
  next();
});

const Workspace = mongoose.model('Workspace', workspaceSchema);

module.exports = Workspace; 