const Joi = require('joi');

const createPageSchema = Joi.object({
  title: Joi.string().required().min(1).max(200),
  content: Joi.object().required(),
  workspaceId: Joi.string().required(),
  parentId: Joi.string().allow(null)
});

const updatePageSchema = Joi.object({
  title: Joi.string().min(1).max(200),
  content: Joi.object()
});

const movePageSchema = Joi.object({
  parentId: Joi.string().allow(null),
  position: Joi.number().integer().min(0)
});

module.exports = {
  createPageSchema,
  updatePageSchema,
  movePageSchema
}; 