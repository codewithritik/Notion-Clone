const Joi = require('joi');

const createTemplateSchema = Joi.object({
  name: Joi.string().required().min(1).max(100),
  description: Joi.string().max(500).allow(''),
  content: Joi.object().required(),
  category: Joi.string().valid('personal', 'work', 'education', 'other').required()
});

const updateTemplateSchema = Joi.object({
  name: Joi.string().min(1).max(100),
  description: Joi.string().max(500).allow(''),
  content: Joi.object(),
  category: Joi.string().valid('personal', 'work', 'education', 'other')
});

module.exports = {
  createTemplateSchema,
  updateTemplateSchema
}; 