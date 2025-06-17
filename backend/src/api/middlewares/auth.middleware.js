const jwt = require('jsonwebtoken');
const { expressjwt: expressJwt } = require('express-jwt');

// JWT authentication middleware
const authenticate = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  requestProperty: 'auth'
});

// Role-based access control middleware
const checkRole = (roles) => {
  return async (req, res, next) => {
    try {
      const workspaceId = req.params.workspaceId || req.body.workspaceId;
      if (!workspaceId) {
        return res.status(400).json({ message: 'Workspace ID is required' });
      }

      const workspace = await req.app.locals.models.Workspace.findById(workspaceId);
      if (!workspace) {
        return res.status(404).json({ message: 'Workspace not found' });
      }

      const member = workspace.members.find(
        m => m.userId.toString() === req.auth.id
      );

      if (!member) {
        return res.status(403).json({ message: 'Not a member of this workspace' });
      }

      if (!roles.includes(member.role)) {
        return res.status(403).json({ message: 'Insufficient permissions' });
      }

      req.workspace = workspace;
      req.memberRole = member.role;
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Generate JWT tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRATION }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRATION }
  );

  return { accessToken, refreshToken };
};

module.exports = {
  authenticate,
  checkRole,
  generateTokens
}; 