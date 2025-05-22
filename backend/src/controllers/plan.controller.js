const Plan = require('../models/plan.model');
const MinioService = require('../services/minio.service');
const LangChainService = require('../services/langchain.service');
const PDFService = require('../services/pdf.service');
const logger = require('../utils/logger');

/**
 * Obter todos os planos do usuu00e1rio ou da empresa
 * @param {Object} req - Requisiu00e7u00e3o Express
 * @param {Object} res - Resposta Express
 */
exports.getPlans = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status, sortBy = 'created_at', sortOrder = 'desc' } = req.query;
    
    // Construir filtro
    const filter = {};
    
    // Superadmin pode ver todos os planos com filtro opcional por empresa
    if (req.user.role === 'superadmin') {
      if (req.query.company_id) {
        filter.company_id = req.query.company_id;
      }
    } else {
      // Usuu00e1rios normais su00f3 podem ver seus pru00f3prios planos
      filter.created_by = req.user._id;
    }
    
    if (search) {
      filter.$or = [
        { 'patient.name': { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) {
      filter.status = status;
    }
    
    // Definir ordenau00e7u00e3o
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    // Contar total de documentos
    const total = await Plan.countDocuments(filter);
    
    // Buscar planos com paginau00e7u00e3o
    const plans = await Plan.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('created_by', 'name email');
    
    return res.status(200).json({
      success: true,
      data: {
        plans,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    logger.error('Erro ao buscar planos:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar planos'
    });
  }
};

/**
 * Obter um plano especu00edfico
 * @param {Object} req - Requisiu00e7u00e3o Express
 * @param {Object} res - Resposta Express
 */
exports.getPlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id)
      .populate('created_by', 'name email');
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plano nu00e3o encontrado'
      });
    }
    
    // Verificar permissu00e3o - apenas o criador ou superadmin podem ver
    if (req.user.role !== 'superadmin' && plan.created_by._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Vocu00ea nu00e3o tem permissu00e3o para visualizar este plano'
      });
    }
    
    // Obter URLs temporarias para arquivos armazenados no MinIO se existirem
    if (plan.exams && plan.exams.length > 0) {
      for (let i = 0; i < plan.exams.length; i++) {
        if (plan.exams[i].file_key) {
          plan.exams[i].file_url = await MinioService.getPresignedUrl(plan.exams[i].file_key);
        }
      }
    }
    
    return res.status(200).json({
      success: true,
      data: plan
    });
  } catch (error) {
    logger.error('Erro ao buscar plano:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar plano'
    });
  }
};

/**
 * Criar um novo plano
 * @param {Object} req - Requisiu00e7u00e3o Express
 * @param {Object} res - Resposta Express
 */
exports.createPlan = async (req, res) => {
  try {
    const { 
      title,
      patient,
      menstrual_history,
      symptoms,
      health_history,
      lifestyle,
      exams,
      tcm_observations,
      timeline,
      ifm_matrix
    } = req.body;
    
    // Validar campos obrigatu00f3rios
    if (!patient || !patient.name) {
      return res.status(400).json({
        success: false,
        message: 'Nome da paciente u00e9 obrigatu00f3rio'
      });
    }
    
    if (!symptoms || !symptoms.length) {
      return res.status(400).json({
        success: false,
        message: 'u00c9 necessu00e1rio informar pelo menos um sintoma'
      });
    }
    
    // Verificar limites da empresa
    const company = req.user.company_id;
    
    if (!company.active) {
      return res.status(403).json({
        success: false,
        message: 'Sua empresa estu00e1 desativada. Entre em contato com o administrador.'
      });
    }
    
    if (company.tokens_used >= company.token_limit) {
      return res.status(403).json({
        success: false,
        message: 'Sua empresa atingiu o limite de tokens. Entre em contato com o administrador.'
      });
    }
    
    // Criar plano
    const plan = await Plan.create({
      title: title || `Plano para ${patient.name}`,
      patient,
      menstrual_history,
      symptoms,
      health_history,
      lifestyle,
      exams: exams || [],
      tcm_observations: tcm_observations || {},
      timeline: timeline || [],
      ifm_matrix: ifm_matrix || {},
      status: 'draft',
      created_by: req.user._id,
      company_id: company._id
    });
    
    return res.status(201).json({
      success: true,
      data: plan
    });
  } catch (error) {
    logger.error('Erro ao criar plano:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao criar plano'
    });
  }
};

/**
 * Atualizar um plano existente
 * @param {Object} req - Requisiu00e7u00e3o Express
 * @param {Object} res - Resposta Express
 */
exports.updatePlan = async (req, res) => {
  try {
    // Buscar plano existente
    const plan = await Plan.findById(req.params.id);
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plano nu00e3o encontrado'
      });
    }
    
    // Verificar permissu00e3o - apenas o criador pode editar
    if (plan.created_by.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Vocu00ea nu00e3o tem permissu00e3o para editar este plano'
      });
    }
    
    // Se o plano ju00e1 estu00e1 finalizado, nu00e3o pode ser editado
    if (plan.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Planos finalizados nu00e3o podem ser editados'
      });
    }
    
    const { 
      title,
      patient,
      menstrual_history,
      symptoms,
      health_history,
      lifestyle,
      exams,
      tcm_observations,
      timeline,
      ifm_matrix,
      status,
      final_plan
    } = req.body;
    
    // Atualizar campos
    if (title) plan.title = title;
    if (patient) plan.patient = { ...plan.patient, ...patient };
    if (menstrual_history) plan.menstrual_history = menstrual_history;
    if (symptoms) plan.symptoms = symptoms;
    if (health_history) plan.health_history = health_history;
    if (lifestyle) plan.lifestyle = lifestyle;
    if (exams) plan.exams = exams;
    if (tcm_observations) plan.tcm_observations = tcm_observations;
    if (timeline) plan.timeline = timeline;
    if (ifm_matrix) plan.ifm_matrix = ifm_matrix;
    if (status) plan.status = status;
    if (final_plan) plan.final_plan = final_plan;
    
    plan.updated_at = Date.now();
    
    // Gerar plano final se status for alterado para 'generating'
    if (status === 'generating' && plan.status !== 'generating') {
      // Registrar inu00edcio da gerau00e7u00e3o
      plan.status = 'generating';
      await plan.save();
      
      try {
        // Processar com LangChain em background
        const generatedPlan = await LangChainService.generatePlan(plan);
        
        // Atualizar o plano com o resultado
        plan.final_plan = generatedPlan;
        plan.status = 'completed';
        plan.generation_completed_at = Date.now();
        
        // Atualizar tokens usados pela empresa
        const company = await Company.findById(plan.company_id);
        company.tokens_used += generatedPlan.token_usage || 0;
        await company.save();
      } catch (error) {
        logger.error('Erro ao gerar plano:', error);
        plan.status = 'error';
        plan.generation_error = error.message;
      }
    }
    
    await plan.save();
    
    return res.status(200).json({
      success: true,
      data: plan
    });
  } catch (error) {
    logger.error('Erro ao atualizar plano:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao atualizar plano'
    });
  }
};

/**
 * Excluir um plano
 * @param {Object} req - Requisiu00e7u00e3o Express
 * @param {Object} res - Resposta Express
 */
exports.deletePlan = async (req, res) => {
  try {
    // Buscar plano existente
    const plan = await Plan.findById(req.params.id);
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plano nu00e3o encontrado'
      });
    }
    
    // Verificar permissu00e3o - apenas o criador pode excluir
    if (plan.created_by.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Vocu00ea nu00e3o tem permissu00e3o para excluir este plano'
      });
    }
    
    // Excluir arquivos associados ao plano no MinIO
    if (plan.exams && plan.exams.length > 0) {
      for (const exam of plan.exams) {
        if (exam.file_key) {
          await MinioService.deleteFile(exam.file_key);
        }
      }
    }
    
    // Excluir plano
    await plan.deleteOne();
    
    return res.status(200).json({
      success: true,
      message: 'Plano excluu00eddo com sucesso'
    });
  } catch (error) {
    logger.error('Erro ao excluir plano:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao excluir plano'
    });
  }
};

/**
 * Exportar plano para PDF
 * @param {Object} req - Requisiu00e7u00e3o Express
 * @param {Object} res - Resposta Express
 */
exports.exportPlan = async (req, res) => {
  try {
    // Buscar plano existente
    const plan = await Plan.findById(req.params.id)
      .populate('created_by', 'name email');
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plano nu00e3o encontrado'
      });
    }
    
    // Verificar permissu00e3o - apenas o criador ou superadmin podem exportar
    if (req.user.role !== 'superadmin' && plan.created_by._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Vocu00ea nu00e3o tem permissu00e3o para exportar este plano'
      });
    }
    
    // Verificar se o plano estu00e1 completo
    if (plan.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Apenas planos finalizados podem ser exportados'
      });
    }
    
    // Gerar PDF
    const pdfBuffer = await PDFService.generatePlanPDF(plan);
    
    // Definir headers para download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${plan.title.replace(/ /g, '_')}.pdf"`);
    
    // Enviar PDF
    res.send(pdfBuffer);
  } catch (error) {
    logger.error('Erro ao exportar plano:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao exportar plano'
    });
  }
};
