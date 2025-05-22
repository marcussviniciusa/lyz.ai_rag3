const express = require('express');
const { validateEmail, register, login, refreshToken } = require('../controllers/auth.controller');
const { validateRequest } = require('../middleware/validator');

const router = express.Router();

// Validau00e7u00e3o de email com Curseduca
router.post('/validate-email', validateEmail);

// Registro de usuu00e1rio
router.post('/register', register);

// Login
router.post('/login', login);

// Refresh token
router.post('/refresh-token', refreshToken);

module.exports = router;
