const express = require('express');
const router = express.Router();
const templateController = require('../controllers/template.controller');
const { validateRequest } = require('../middlewares/validation.middleware');
const { authenticate } = require('../middlewares/auth.middleware');
const { 
  createTemplateSchema, 
  updateTemplateSchema
} = require('../validations/template.validation');

// All routes require authentication
router.use(authenticate);

// Create template
router.post('/',
  validateRequest(createTemplateSchema),
  templateController.createTemplate
);

// Get all templates
router.get('/', templateController.getAllTemplates);

// Get template by ID
router.get('/:templateId', templateController.getTemplateById);

// Update template
router.put('/:templateId',
  validateRequest(updateTemplateSchema),
  templateController.updateTemplate
);

// Delete template
router.delete('/:templateId', templateController.deleteTemplate);

// Use template to create page
router.post('/:templateId/use', templateController.useTemplate);

module.exports = router; 