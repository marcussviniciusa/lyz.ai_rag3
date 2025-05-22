const { validationResult } = require('express-validator');

/**
 * Middleware para validau00e7u00e3o de requisiu00e7u00f5es
 * @param {Object} req - Requisiu00e7u00e3o Express
 * @param {Object} res - Resposta Express
 * @param {Function} next - Pru00f3xima middleware
 */
exports.validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Erros de validau00e7u00e3o',
      errors: errors.array()
    });
  }
  
  next();
};
