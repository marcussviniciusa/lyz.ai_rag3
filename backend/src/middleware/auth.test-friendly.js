/**
 * Versu00e3o simplificada do middleware de autenticau00e7u00e3o para testes
 * Esta versu00e3o foi criada para ser mais facilmente testada sem depender do MongoDB Memory Server
 */

const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const logger = require('../utils/logger');

/**
 * Middleware para verificar se o usuu00e1rio estu00e1 autenticado
 * @param {Object} req - Requisiu00e7u00e3o Express
 * @param {Object} res - Resposta Express
 * @param {Function} next - Pru00f3ximo middleware
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
    
    // Extrair e verificar o token
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Acesso nu00e3o autorizado. Token nu00e3o fornecido.'
      });
    }
    
    try {
      // Decodificar o token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test-secret-key');
      
      // Buscar o usuu00e1rio
      try {
        const populatePromise = User.findById(decoded.id).populate('company_id');
        const user = await populatePromise;
        
        if (!user) {
          return res.status(404).json({
            success: false,
            message: 'Usuu00e1rio nu00e3o encontrado.'
          });
        }
        
        // Verificar se o usuu00e1rio estu00e1 ativo - comparamos com false explicitamente
        if (user.active === false) {
          return res.status(403).json({
            success: false,
            message: 'Usuu00e1rio inativo. Entre em contato com o administrador.'
          });
        }
      } catch (error) {
        logger.error('Erro ao buscar usuu00e1rio:', error);
        return res.status(500).json({
          success: false,
          message: 'Erro ao buscar usuu00e1rio no banco de dados.'
        });
      }
      
      // Adicionar o usuu00e1rio u00e0 requisiu00e7u00e3o
      req.user = user;
      
      next();
    } catch (error) {
      // Sempre retornar 401 para problemas relacionados a token
      return res.status(401).json({
        success: false,
        message: error.name === 'TokenExpiredError' ? 'Token invu00e1lido ou expirado.' : 'Token invu00e1lido.'
      });
    }
  } catch (error) {
    logger.error('Erro de autenticau00e7u00e3o:', error);
    
    // Tratamento genu00e9rico de erros
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor.'
    });
  }
};

/**
 * Middleware para verificar se o usuu00e1rio tem permissu00e3o para acessar o recurso
 * @param {string} role - Papel requerido para acessar o recurso
 * @returns {Function} Middleware para verificar permissu00e3o
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
