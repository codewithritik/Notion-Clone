const Template = require('../../models/template.model');
const Page = require('../../models/page.model');
const { NotFoundError } = require('../utils/errors');

const templateController = {
  // Create a new template
  async createTemplate(req, res) {
    const { name, description, content, category } = req.body;
    const userId = req.auth.id;

    const template = await Template.create({
      name,
      description,
      content,
      category,
      createdBy: userId
    });

    res.status(201).json(template);
  },

  // Get all templates
  async getAllTemplates(req, res) {
    const templates = await Template.find()
      .populate('createdBy', 'name email');

    res.json(templates);
  },

  // Get template by ID
  async getTemplateById(req, res) {
    const { templateId } = req.params;

    const template = await Template.findById(templateId)
      .populate('createdBy', 'name email');

    if (!template) {
      throw new NotFoundError('Template not found');
    }

    res.json(template);
  },

  // Update template
  async updateTemplate(req, res) {
    const { templateId } = req.params;
    const { name, description, content, category } = req.body;
    const userId = req.auth.id;

    const template = await Template.findOne({
      _id: templateId,
      createdBy: userId
    });

    if (!template) {
      throw new NotFoundError('Template not found or insufficient permissions');
    }

    template.name = name || template.name;
    template.description = description || template.description;
    template.content = content || template.content;
    template.category = category || template.category;
    await template.save();

    res.json(template);
  },

  // Delete template
  async deleteTemplate(req, res) {
    const { templateId } = req.params;
    const userId = req.auth.id;

    const template = await Template.findOne({
      _id: templateId,
      createdBy: userId
    });

    if (!template) {
      throw new NotFoundError('Template not found or insufficient permissions');
    }

    await template.remove();
    res.status(204).send();
  },

  // Use template to create page
  async useTemplate(req, res) {
    const { templateId } = req.params;
    const { workspaceId, parentId } = req.body;
    const userId = req.auth.id;

    const template = await Template.findById(templateId);

    if (!template) {
      throw new NotFoundError('Template not found');
    }

    const page = await Page.create({
      title: template.name,
      content: template.content,
      workspaceId,
      parentId,
      createdBy: userId,
      updatedBy: userId
    });

    res.status(201).json(page);
  }
};

module.exports = templateController; 