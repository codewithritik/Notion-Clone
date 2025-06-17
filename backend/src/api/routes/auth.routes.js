const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validateRequest } = require('../middlewares/validation.middleware');
const { signupSchema, loginSchema, refreshTokenSchema } = require('../validations/auth.validation');

// Sign up route
router.post('/signup', 
  validateRequest(signupSchema),
  authController.signup
);

// Login route
router.post('/login',
  validateRequest(loginSchema),
  authController.login
);

// Refresh token route
router.post('/refresh-token',
  validateRequest(refreshTokenSchema),
  authController.refreshToken
);

module.exports = router; 