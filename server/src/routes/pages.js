import express from 'express';
import { body } from 'express-validator';
import { auth } from '../middleware/auth.js';
import {
  createPage,
  getPages,
  getPage,
  updatePage,
  deletePage
} from '../controllers/pageController.js';

const router = express.Router();

// All routes require authentication
router.use(auth);

// Create a new page
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('content').optional(),
    body('parentId').optional().isMongoId().withMessage('Invalid parent ID')
  ],
  createPage
);

// Get all pages
router.get('/', getPages);

// Get a single page
router.get('/:id', getPage);

// Update a page
router.put(
  '/:id',
  [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('content').optional(),
    body('parentId').optional().isMongoId().withMessage('Invalid parent ID'),
    body('order').optional().isNumeric().withMessage('Order must be a number')
  ],
  updatePage
);

// Delete a page
router.delete('/:id', deletePage);

export default router; 