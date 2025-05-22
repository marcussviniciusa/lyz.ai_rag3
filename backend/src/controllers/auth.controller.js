const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Company = require('../models/company.model');
const { validateCursEducaUser } = require('../services/curseduca.service');
const logger = require('../utils/logger');

/**
 * Cria uma empresa para um novo usuu00e1rio
 * @param {string} userName - Nome do usuu00e1rio para criar a empresa
 * @returns {Promise<Object>} Resultado da criau00e7u00e3o da empresa
 */
const createCompanyForUser = async (userName) => {
  try {
    const companyName = `${userName} - Empresa`;
    
    const company = await Company.create({
      name: companyName,
      active: true,
      token_limit: 100000, // Limite padru00e3o
      tokens_used: 0
    });
    
    return {
      success: true,
      company
    };
  } catch (error) {
    logger.error('Erro ao criar empresa:', error);
    return {
      success: false,
      message: error.message || 'Falha ao criar empresa para o usuu00e1rio'
    };
  }
};

/**
 * Cria um usuu00e1rio a partir dos dados do Curseduca
 * @param {Object} cursEducaData - Dados do usuu00e1rio do Curseduca
 * @param {string} password - Senha do usuu00e1rio
 * @returns {Promise<Object>} Resultado da criau00e7u00e3o do usuu00e1rio
 */
const createUserFromCurseduca = async (cursEducaData, password) => {
  try {
    // Verificar se o usuu00e1rio ju00e1 existe
    const existingUser = await User.findOne({ curseduca_id: cursEducaData.id.toString() });
    
    if (existingUser) {
      return {
        success: false,
        message: 'Usuu00e1rio ju00e1 cadastrado no sistema'
      };
    }
    
    // Criar uma empresa para o usuu00e1rio
    const companyResult = await createCompanyForUser(cursEducaData.name);
    
    if (!companyResult.success) {
      return {
        success: false,
        message: companyResult.message || 'Falha ao criar empresa para o usuu00e1rio'
      };
    }
    
    const user = await User.create({
      curseduca_id: cursEducaData.id.toString(),
      name: cursEducaData.name,
      email: cursEducaData.email,
      password,
      role: 'user',
      company_id: companyResult.company._id
    });
    
    return {
      success: true,
      user,
      company: companyResult.company
    };
  } catch (error) {
    logger.error('Erro ao criar usuu00e1rio:', error);
    return {
      success: false,
      message: error.message || 'Erro ao criar usuu00e1rio'
    };
  }
};

/**
 * Validar o email do usuu00e1rio com o Curseduca
 * @param {Object} req - Requisiu00e7u00e3o Express
 * @param {Object} res - Resposta Express
 */
exports.validateEmail = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email u00e9 obrigatu00f3rio'
      });
    }
    
    // Verificar se o usuu00e1rio ju00e1 existe no sistema
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email ju00e1 cadastrado no sistema'
      });
    }
    
    // Validar com o Curseduca
    const cursEducaResult = await validateCursEducaUser(email);
    
    if (!cursEducaResult.success) {
      return res.status(404).json({
        success: false,
        message: cursEducaResult.message
      });
    }
    
    // Email validado com sucesso
    return res.status(200).json({
      success: true,
      message: 'Email validado com sucesso',
      userData: cursEducaResult.data
    });
  } catch (error) {
    logger.error('Erro na validau00e7u00e3o de email:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao validar email'
    });
  }
};

/**
 * Registrar um novo usuu00e1rio
 * @param {Object} req - Requisiu00e7u00e3o Express
 * @param {Object} res - Resposta Express
 */
exports.register = async (req, res) => {
  try {
    const { curseduca_id, name, email, password } = req.body;
    
    if (!curseduca_id || !name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Todos os campos su00e3o obrigatu00f3rios'
      });
    }
    
    // Validar novamente com o Curseduca
    const cursEducaResult = await validateCursEducaUser(email);
    
    if (!cursEducaResult.success) {
      return res.status(404).json({
        success: false,
        message: cursEducaResult.message
      });
    }
    
    // Verificar se os dados batem com os do Curseduca
    const cursEducaData = cursEducaResult.data;
    
    if (cursEducaData.id.toString() !== curseduca_id || 
        cursEducaData.email !== email || 
        cursEducaData.name !== name) {
      return res.status(400).json({
        success: false,
        message: 'Dados invu00e1lidos. Por favor, valide seu email novamente.'
      });
    }
    
    // Criar usuu00e1rio
    const createResult = await createUserFromCurseduca(cursEducaData, password);
    
    if (!createResult.success) {
      return res.status(400).json({
        success: false,
        message: createResult.message
      });
    }
    
    // Gerar tokens de acesso
    const accessToken = jwt.sign(
      { id: createResult.user._id, role: createResult.user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    const refreshToken = jwt.sign(
      { id: createResult.user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );
    
    return res.status(201).json({
      success: true,
      message: 'Usuu00e1rio registrado com sucesso',
      user: {
        id: createResult.user._id,
        name: createResult.user.name,
        email: createResult.user.email,
        role: createResult.user.role,
        company_id: createResult.user.company_id
      },
      tokens: {
        access: accessToken,
        refresh: refreshToken
      }
    });
  } catch (error) {
    logger.error('Erro no registro de usuu00e1rio:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao registrar usuu00e1rio'
    });
  }
};

/**
 * Login de usuu00e1rio
 * @param {Object} req - Requisiu00e7u00e3o Express
 * @param {Object} res - Resposta Express
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Buscar usuu00e1rio
    const user = await User.findOne({ email }).populate('company_id');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuu00e1rio nu00e3o encontrado'
      });
    }
    
    // Verificar se usuu00e1rio estu00e1 ativo
    if (!user.active) {
      return res.status(403).json({
        success: false,
        message: 'Usuu00e1rio inativo. Entre em contato com o administrador.'
      });
    }
    
    // Verificar senha
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais invu00e1lidas'
      });
    }
    
    // Atualizar u00faltimo login
    user.last_login = Date.now();
    await user.save();
    
    // Gerar tokens
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );
    
    return res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: {
          id: user.company_id._id,
          name: user.company_id.name
        }
      },
      tokens: {
        access: accessToken,
        refresh: refreshToken
      }
    });
  } catch (error) {
    logger.error('Erro no login:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao realizar login'
    });
  }
};

/**
 * Atualizar access token usando refresh token
 * @param {Object} req - Requisiu00e7u00e3o Express
 * @param {Object} res - Resposta Express
 */
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token nu00e3o fornecido'
      });
    }
    
    // Verificar token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Buscar usuu00e1rio
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuu00e1rio nu00e3o encontrado'
      });
    }
    
    // Verificar se usuu00e1rio estu00e1 ativo
    if (!user.active) {
      return res.status(403).json({
        success: false,
        message: 'Usuu00e1rio inativo. Entre em contato com o administrador.'
      });
    }
    
    // Gerar novo access token
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    return res.status(200).json({
      success: true,
      accessToken
    });
  } catch (error) {
    logger.error('Erro no refresh token:', error);
    
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token invu00e1lido ou expirado'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Erro ao atualizar token'
    });
  }
};
