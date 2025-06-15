import Page from '../models/Page.js';
import { validationResult } from 'express-validator';

// Create a new page
export const createPage = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, parentId } = req.body;
    const authorId = req.user._id;

    const page = new Page({
      title,
      content,
      parentId,
      authorId,
      order: 0 // Default order
    });

    await page.save();
    res.status(201).json(page);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all pages for a user (with hierarchy)
export const getPages = async (req, res) => {
  try {
    const pages = await Page.find({ authorId: req.user._id })
      .sort({ order: 1, createdAt: 1 });

    // Build hierarchy
    const pageMap = new Map();
    const rootPages = [];

    // First pass: create map of all pages
    pages.forEach(page => {
      pageMap.set(page._id.toString(), {
        ...page.toObject(),
        children: []
      });
    });

    // Second pass: build hierarchy
    pages.forEach(page => {
      const pageObj = pageMap.get(page._id.toString());
      if (page.parentId) {
        const parent = pageMap.get(page.parentId.toString());
        if (parent) {
          parent.children.push(pageObj);
        }
      } else {
        rootPages.push(pageObj);
      }
    });

    res.json(rootPages);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get a single page
export const getPage = async (req, res) => {
  try {
    const page = await Page.findOne({
      _id: req.params.id,
      authorId: req.user._id
    });

    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    res.json(page);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Update a page
export const updatePage = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, parentId, order } = req.body;
    const page = await Page.findOne({
      _id: req.params.id,
      authorId: req.user._id
    });

    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    // Update fields
    if (title !== undefined) page.title = title;
    if (content !== undefined) page.content = content;
    if (parentId !== undefined) page.parentId = parentId;
    if (order !== undefined) page.order = order;

    await page.save();
    res.json(page);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a page
export const deletePage = async (req, res) => {
  try {
    const page = await Page.findOne({
      _id: req.params.id,
      authorId: req.user._id
    });

    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    // Delete the page and all its children
    await Page.deleteMany({
      $or: [
        { _id: page._id },
        { parentId: page._id }
      ]
    });

    res.json({ message: 'Page deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}; 