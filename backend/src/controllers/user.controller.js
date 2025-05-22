const User = require('../models/user.model');
const Company = require('../models/company.model');
const logger = require('../utils/logger');
const bcrypt = require('bcryptjs');

/**
 * Obter todos os usuu00e1rios (para superadmin)
 * @param {Object} req - Requisiu00e7u00e3o Express
 * @param {Object} res - Resposta Express
 */
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status, company_id } = req.query;
    
    // Construir filtro
    const filter = {};
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) {
      filter.active = status === 'active';
    }
    
    if (company_id) {
      filter.company_id = company_id;
    }
    
    // Contar total de documentos
    const total = await User.countDocuments(filter);
    
    // Buscar usuu00e1rios com paginau00e7u00e3o
    const users = await User.find(filter)
      .select('-password')
      .populate('company_id', 'name active')
      .sort({ created_at: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    return res.status(200).json({
      success: true,
      data: {
        users,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    logger.error('Erro ao buscar usuu00e1rios:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar usuu00e1rios'
    });
  }
};

/**
 * Obter um usuu00e1rio especu00edfico
 * @param {Object} req - Requisiu00e7u00e3o Express
 * @param {Object} res - Resposta Express
 */
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('company_id', 'name active token_limit tokens_used');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuu00e1rio nu00e3o encontrado'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    logger.error('Erro ao buscar usuu00e1rio:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar usuu00e1rio'
    });
  }
};

/**
 * Criar um novo usuu00e1rio (apenas superadmin)
 * @param {Object} req - Requisiu00e7u00e3o Express
 * @param {Object} res - Resposta Express
 */
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, company_id, active, curseduca_id } = req.body;
    
    // Validar campos obrigatu00f3rios
    if (!name || !email || !password || !company_id) {
      return res.status(400).json({
        success: false,
        message: 'Nome, email, senha e ID da empresa su00e3o obrigatu00f3rios'
      });
    }
    
    // Verificar se o email ju00e1 estu00e1 em uso
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email ju00e1 estu00e1 em uso'
      });
    }
    
    // Verificar se a empresa existe
    const company = await Company.findById(company_id);
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Empresa nu00e3o encontrada'
      });
    }
    
    // Criar usuu00e1rio
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user',
      company_id,
      active: active !== undefined ? active : true,
      curseduca_id: curseduca_id || `manual-${Date.now()}`
    });
    
    // Remover senha da resposta
    user.password = undefined;
    
    return res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    logger.error('Erro ao criar usuu00e1rio:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao criar usuu00e1rio'
    });
  }
};

/**
 * Atualizar um usuu00e1rio
 * @param {Object} req - Requisiu00e7u00e3o Express
 * @param {Object} res - Resposta Express
 */
exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, company_id, active } = req.body;
    
    // Verificar se o usuu00e1rio existe
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuu00e1rio nu00e3o encontrado'
      });
    }
    
    // Verificar se o email ju00e1 estu00e1 em uso por outro usuu00e1rio
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      
      if (existingUser && existingUser._id.toString() !== req.params.id) {
        return res.status(400).json({
          success: false,
          message: 'Email ju00e1 estu00e1 em uso por outro usuu00e1rio'
        });
      }
    }
    
    // Verificar se a empresa existe
    if (company_id && company_id !== user.company_id.toString()) {
      const company = await Company.findById(company_id);
      
      if (!company) {
        return res.status(404).json({
          success: false,
          message: 'Empresa nu00e3o encontrada'
        });
      }
    }
    
    // Atualizar usuu00e1rio
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (company_id) user.company_id = company_id;
    if (active !== undefined) user.active = active;
    
    user.updated_at = Date.now();
    await user.save();
    
    // Remover senha da resposta
    user.password = undefined;
    
    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    logger.error('Erro ao atualizar usuu00e1rio:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao atualizar usuu00e1rio'
    });
  }
};

/**
 * Excluir um usuu00e1rio
 * @param {Object} req - Requisiu00e7u00e3o Express
 * @param {Object} res - Resposta Express
 */
exports.deleteUser = async (req, res) => {
  try {
    // Verificar se o usuu00e1rio existe
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuu00e1rio nu00e3o encontrado'
      });
    }
    
    // Nu00e3o permitir exclusu00e3o do pru00f3prio usuu00e1rio
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Nu00e3o u00e9 possu00edvel excluir seu pru00f3prio usuu00e1rio'
      });
    }
    
    // Excluir usuu00e1rio
    await user.deleteOne();
    
    return res.status(200).json({
      success: true,
      message: 'Usuu00e1rio excluu00eddo com sucesso'
    });
  } catch (error) {
    logger.error('Erro ao excluir usuu00e1rio:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao excluir usuu00e1rio'
    });
  }
};

/**
 * Atualizar senha do usuu00e1rio atual
 * @param {Object} req - Requisiu00e7u00e3o Express
 * @param {Object} res - Resposta Express
 */
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Senha atual e nova senha su00e3o obrigatu00f3rias'
      });
    }
    
    // Verificar senha atual
    const user = await User.findById(req.user._id);
    const isMatch = await user.comparePassword(currentPassword);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Senha atual incorreta'
      });
    }
    
    // Validar nova senha
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'A nova senha deve ter pelo menos 8 caracteres'
      });
    }
    
    // Atualizar senha
    user.password = newPassword;
    user.updated_at = Date.now();
    await user.save();
    
    return res.status(200).json({
      success: true,
      message: 'Senha atualizada com sucesso'
    });
  } catch (error) {
    logger.error('Erro ao atualizar senha:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao atualizar senha'
    });
  }
};
