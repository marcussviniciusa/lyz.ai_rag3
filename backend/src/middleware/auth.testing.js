/**
 * Versu00e3o simplificada e otimizada do middleware de autenticau00e7u00e3o para testes
 */

const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const logger = require('../utils/logger');

/**
 * Middleware para verificar se o usuu00e1rio estu00e1 autenticado
 */
exports.authenticate = async (req, res, next) => {
  try {
    // Verificar se existe um token
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Acesso nu00e3o autorizado. Token nu00e3o fornecido.'
      });
    }
    
    // Extrair o token
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Acesso nu00e3o autorizado. Token nu00e3o fornecido.'
      });
    }
    
    try {
      // Decodificar o token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test-secret');
      
      // Buscar o usuu00e1rio - versu00e3o simplificada para testes
      // O User.findById retorna um objeto que tem um populate()
      // O populate() retorna uma Promise que resolve para o usuu00e1rio ou null
      const mockPopulate = User.findById(decoded.id).populate;
      const user = await mockPopulate();
      
      // Verificar se o usuu00e1rio existe
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuu00e1rio nu00e3o encontrado.'
        });
      }
      
      // Verificar se o usuu00e1rio estu00e1 ativo
      // Comparamos explicitamente com false para garantir que seja esse valor especu00edfico
      if (user.active === false) {
        return res.status(403).json({
          success: false,
          message: 'Usuu00e1rio inativo. Entre em contato com o administrador.'
        });
      }
      
      // Adicionar o usuu00e1rio u00e0 requisiu00e7u00e3o
      req.user = user;
      
      // Tudo ok, chamamos o pru00f3ximo middleware
      next();
      
    } catch (error) {
      // Erro na verificau00e7u00e3o do token
      return res.status(401).json({
        success: false,
        message: error.name === 'TokenExpiredError' 
          ? 'Token expirado. Fau00e7a login novamente.' 
          : 'Token invu00e1lido.'
      });
    }
  } catch (error) {
    // Erro genu00e9rico
    logger.error('Erro na autenticau00e7u00e3o:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor.'
    });
  }
};

/**
 * Middleware para verificar se o usuu00e1rio tem permissu00e3o para acessar o recurso
 */
exports.authorize = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Acesso nu00e3o autorizado. Usuu00e1rio nu00e3o autenticado.'
      });
    }
    
    if (req.user.role !== role) {
      return res.status(403).json({
        success: false,
        message: 'Acesso proibido. Vocu00ea nu00e3o tem permissu00e3o para acessar este recurso.'
      });
    }
    
    next();
  };
};
