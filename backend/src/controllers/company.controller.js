const Company = require('../models/company.model');
const User = require('../models/user.model');
const logger = require('../utils/logger');

/**
 * Obter todas as empresas
 * @param {Object} req - Requisiu00e7u00e3o Express
 * @param {Object} res - Resposta Express
 */
exports.getCompanies = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status } = req.query;
    
    // Construir filtro
    const filter = {};
    
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    
    if (status) {
      filter.active = status === 'active';
    }
    
    // Contar total de documentos
    const total = await Company.countDocuments(filter);
    
    // Buscar empresas com paginau00e7u00e3o
    const companies = await Company.find(filter)
      .sort({ created_at: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    return res.status(200).json({
      success: true,
      data: {
        companies,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    logger.error('Erro ao buscar empresas:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar empresas'
    });
  }
};

/**
 * Obter empresa por ID
 * @param {Object} req - Requisiu00e7u00e3o Express
 * @param {Object} res - Resposta Express
 */
exports.getCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Empresa nu00e3o encontrada'
      });
    }
    
    // Contar usuu00e1rios da empresa
    const userCount = await User.countDocuments({ company_id: company._id });
    
    return res.status(200).json({
      success: true,
      data: {
        ...company.toObject(),
        userCount
      }
    });
  } catch (error) {
    logger.error('Erro ao buscar empresa:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar empresa'
    });
  }
};

/**
 * Criar empresa
 * @param {Object} req - Requisiu00e7u00e3o Express
 * @param {Object} res - Resposta Express
 */
exports.createCompany = async (req, res) => {
  try {
    const { name, token_limit, active } = req.body;
    
    // Validar campos obrigatu00f3rios
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Nome da empresa u00e9 obrigatu00f3rio'
      });
    }
    
    // Verificar se ju00e1 existe uma empresa com o mesmo nome
    const existingCompany = await Company.findOne({ name });
    
    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message: 'Ju00e1 existe uma empresa com este nome'
      });
    }
    
    // Criar empresa
    const company = await Company.create({
      name,
      token_limit: token_limit || 100000, // Valor padru00e3o
      active: active !== undefined ? active : true,
      tokens_used: 0
    });
    
    return res.status(201).json({
      success: true,
      data: company
    });
  } catch (error) {
    logger.error('Erro ao criar empresa:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao criar empresa'
    });
  }
};

/**
 * Atualizar empresa
 * @param {Object} req - Requisiu00e7u00e3o Express
 * @param {Object} res - Resposta Express
 */
exports.updateCompany = async (req, res) => {
  try {
    const { name, token_limit, active } = req.body;
    
    // Verificar se a empresa existe
    const company = await Company.findById(req.params.id);
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Empresa nu00e3o encontrada'
      });
    }
    
    // Verificar se o nome ju00e1 estu00e1 em uso por outra empresa
    if (name && name !== company.name) {
      const existingCompany = await Company.findOne({ name });
      
      if (existingCompany && existingCompany._id.toString() !== req.params.id) {
        return res.status(400).json({
          success: false,
          message: 'Ju00e1 existe uma empresa com este nome'
        });
      }
    }
    
    // Atualizar empresa
    company.name = name || company.name;
    company.token_limit = token_limit !== undefined ? token_limit : company.token_limit;
    company.active = active !== undefined ? active : company.active;
    company.updated_at = Date.now();
    
    await company.save();
    
    return res.status(200).json({
      success: true,
      data: company
    });
  } catch (error) {
    logger.error('Erro ao atualizar empresa:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao atualizar empresa'
    });
  }
};

/**
 * Excluir empresa
 * @param {Object} req - Requisiu00e7u00e3o Express
 * @param {Object} res - Resposta Express
 */
exports.deleteCompany = async (req, res) => {
  try {
    // Verificar se a empresa existe
    const company = await Company.findById(req.params.id);
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Empresa nu00e3o encontrada'
      });
    }
    
    // Verificar se existem usuu00e1rios associados u00e0 empresa
    const userCount = await User.countDocuments({ company_id: company._id });
    
    if (userCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Nu00e3o u00e9 possu00edvel excluir a empresa pois existem ${userCount} usuu00e1rios associados. Desative a empresa em vez de excluir.`
      });
    }
    
    // Excluir empresa
    await company.deleteOne();
    
    return res.status(200).json({
      success: true,
      message: 'Empresa excluída com sucesso'
    });
  } catch (error) {
    logger.error('Erro ao excluir empresa:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao excluir empresa'
    });
  }
};
