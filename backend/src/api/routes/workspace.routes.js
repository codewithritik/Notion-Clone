const express = require('express');
const router = express.Router();
const workspaceController = require('../controllers/workspace.controller');
const { validateRequest } = require('../middlewares/validation.middleware');
const { authenticate } = require('../middlewares/auth.middleware');
const { 
  createWorkspaceSchema, 
  updateWorkspaceSchema,
  addMemberSchema,
  updateMemberRoleSchema
} = require('../validations/workspace.validation');

// All routes require authentication
router.use(authenticate);

// Create workspace
router.post('/',
  validateRequest(createWorkspaceSchema),
  workspaceController.createWorkspace
);

// Get all workspaces for current user
router.get('/', workspaceController.getUserWorkspaces);

// Get workspace by ID
router.get('/:workspaceId', workspaceController.getWorkspaceById);

// Update workspace
router.put('/:workspaceId',
  validateRequest(updateWorkspaceSchema),
  workspaceController.updateWorkspace
);

// Delete workspace
router.delete('/:workspaceId', workspaceController.deleteWorkspace);

// Add member to workspace
router.post('/:workspaceId/members',
  validateRequest(addMemberSchema),
  workspaceController.addMember
);

// Update member role
router.put('/:workspaceId/members/:userId',
  validateRequest(updateMemberRoleSchema),
  workspaceController.updateMemberRole
);

// Remove member from workspace
router.delete('/:workspaceId/members/:userId', workspaceController.removeMember);

module.exports = router; 