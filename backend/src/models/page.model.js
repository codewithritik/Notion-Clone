const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: false,
    unique: true,
    trim: true
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  tags: {
    type: [String],
    default: [],
    trim: true
  },
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Generate slug from title before saving
pageSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    const currentDate = new Date();
    this.slug = `${this.title}-${currentDate}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
  next();
});

// Index for faster queries
pageSchema.index({ workspaceId: 1, slug: 1 });

const Page = mongoose.model('Page', pageSchema);

module.exports = Page; 