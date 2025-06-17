const Workspace = require('../../models/workspace.model');
const User = require('../../models/user.model');
const { NotFoundError, ForbiddenError } = require('../utils/errors');

const workspaceController = {
  // Create a new workspace
  async createWorkspace(req, res) {
    const { name, description } = req.body;
    const userId = req.auth.id;

    const workspace = await Workspace.create({
      name,
      description,
      createdBy: userId
    });

    res.status(201).json(workspace);
  },

  // Get all workspaces for current user
  async getUserWorkspaces(req, res) {
    const userId = req.auth.id;
    const workspaces = await Workspace.find({
      'members.userId': userId
    }).populate('createdBy', 'name email');

    res.json(workspaces);
  },

  // Get workspace by ID
  async getWorkspaceById(req, res) {
    const { workspaceId } = req.params;
    const userId = req.auth.id;

    const workspace = await Workspace.findOne({
      _id: workspaceId,
      'members.userId': userId
    }).populate('createdBy', 'name email')
      .populate('members.userId', 'name email');

    if (!workspace) {
      throw new NotFoundError('Workspace not found');
    }

    res.json(workspace);
  },

  // Update workspace
  async updateWorkspace(req, res) {
    const { workspaceId } = req.params;
    const userId = req.auth.id;
    const { name, description } = req.body;

    const workspace = await Workspace.findOne({
      _id: workspaceId,
      'members.userId': userId,
      'members.role': { $in: ['owner', 'editor'] }
    });

    if (!workspace) {
      throw new NotFoundError('Workspace not found or insufficient permissions');
    }

    workspace.name = name || workspace.name;
    workspace.description = description || workspace.description;
    await workspace.save();

    res.json(workspace);
  },

  // Delete workspace
  async deleteWorkspace(req, res) {
    const { workspaceId } = req.params;
    const userId = req.auth.id;

    const workspace = await Workspace.findOne({
      _id: workspaceId,
      'members.userId': userId,
      'members.role': 'owner'
    });

    if (!workspace) {
      throw new NotFoundError('Workspace not found or insufficient permissions');
    }

    await workspace.remove();
    res.status(204).send();
  },

  // Add member to workspace
  async addMember(req, res) {
    const { workspaceId } = req.params;
    const { email, role } = req.body;
    const userId = req.auth.id;

    const workspace = await Workspace.findOne({
      _id: workspaceId,
      'members.userId': userId,
      'members.role': { $in: ['owner', 'editor'] }
    });

    if (!workspace) {
      throw new NotFoundError('Workspace not found or insufficient permissions');
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Check if user is already a member
    const isMember = workspace.members.some(member => 
      member.userId.toString() === user._id.toString()
    );

    if (isMember) {
      throw new ForbiddenError('User is already a member');
    }

    workspace.members.push({
      userId: user._id,
      role
    });

    await workspace.save();
    res.json(workspace);
  },

  // Update member role
  async updateMemberRole(req, res) {
    const { workspaceId, userId } = req.params;
    const { role } = req.body;
    const currentUserId = req.auth.id;

    const workspace = await Workspace.findOne({
      _id: workspaceId,
      'members.userId': currentUserId,
      'members.role': 'owner'
    });

    if (!workspace) {
      throw new NotFoundError('Workspace not found or insufficient permissions');
    }

    const member = workspace.members.find(m => 
      m.userId.toString() === userId
    );

    if (!member) {
      throw new NotFoundError('Member not found');
    }

    member.role = role;
    await workspace.save();

    res.json(workspace);
  },

  // Remove member from workspace
  async removeMember(req, res) {
    const { workspaceId, userId } = req.params;
    const currentUserId = req.auth.id;

    const workspace = await Workspace.findOne({
      _id: workspaceId,
      'members.userId': currentUserId,
      'members.role': 'owner'
    });

    if (!workspace) {
      throw new NotFoundError('Workspace not found or insufficient permissions');
    }

    workspace.members = workspace.members.filter(member => 
      member.userId.toString() !== userId
    );

    await workspace.save();
    res.status(204).send();
  }
};

module.exports = workspaceController; 