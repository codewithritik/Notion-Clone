const Joi = require('joi');

const createWorkspaceSchema = Joi.object({
  name: Joi.string().required().min(1).max(100),
  description: Joi.string().max(500).allow('')
});

const updateWorkspaceSchema = Joi.object({
  name: Joi.string().min(1).max(100),
  description: Joi.string().max(500).allow('')
});

const addMemberSchema = Joi.object({
  email: Joi.string().email().required(),
  role: Joi.string().valid('editor', 'viewer').required()
});

const updateMemberRoleSchema = Joi.object({
  role: Joi.string().valid('owner', 'editor', 'viewer').required()
});

module.exports = {
  createWorkspaceSchema,
  updateWorkspaceSchema,
  addMemberSchema,
  updateMemberRoleSchema
}; 