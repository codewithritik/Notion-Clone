const express = require('express');
const router = express.Router();
const pageController = require('../controllers/page.controller');
const { validateRequest } = require('../middlewares/validation.middleware');
const { authenticate } = require('../middlewares/auth.middleware');
const { 
  createPageSchema, 
  updatePageSchema,
  movePageSchema
} = require('../validations/page.validation');

// All routes require authentication
router.use(authenticate);

// Create page
router.post('/',
  validateRequest(createPageSchema),
  pageController.createPage
);

// Get all pages in workspace
router.get('/workspace/:workspaceId', pageController.getWorkspacePages);

// Get page by ID
router.get('/:pageId', pageController.getPageById);

// Update page
router.put('/:pageId',
  validateRequest(updatePageSchema),
  pageController.updatePage
);

// Delete page
router.delete('/:pageId', pageController.deletePage);

// Move page
router.post('/:pageId/move',
  validateRequest(movePageSchema),
  pageController.movePage
);

// Get page history
router.get('/:pageId/history', pageController.getPageHistory);

// Restore page version
router.post('/:pageId/restore/:versionId', pageController.restorePageVersion);

// Add tag to page
router.post('/:pageId/tags', pageController.addTagToPage);

// Get link suggestions
router.post('/workspaces/:workspaceId/suggest-links', pageController.getLinkSuggestions);

module.exports = router; 