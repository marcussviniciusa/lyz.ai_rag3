const express = require('express');
const { getPlans, getPlan, createPlan, updatePlan, deletePlan, exportPlan } = require('../controllers/plan.controller');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Rotas protegidas - apenas usuários autenticados podem acessar
router.get('/', authenticate, getPlans);

// Rota especial para estatísticas - deve vir antes da rota de ID
router.get('/stats', authenticate, async (req, res) => {
  try {
    // Contagem de planos por status
    const totalPlans = await require('../models/plan.model').countDocuments({});
    const completedPlans = await require('../models/plan.model').countDocuments({ status: 'completed' });
    const inProgressPlans = await require('../models/plan.model').countDocuments({ status: 'in_progress' });
    const draftPlans = await require('../models/plan.model').countDocuments({ status: 'draft' });
    
    // Contagem de pacientes únicos (baseado nos campos de paciente dos planos)
    const patients = await require('../models/plan.model').distinct('patient.name');
    const totalPatients = patients.length;
    
    return res.status(200).json({
      success: true,
      data: {
        plans: totalPlans,
        completed: completedPlans,
        in_progress: inProgressPlans,
        draft: draftPlans,
        patients: totalPatients
      }
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar estatísticas'
    });
  }
});

router.get('/:id', authenticate, getPlan);
router.post('/', authenticate, createPlan);
router.put('/:id', authenticate, updatePlan);
router.delete('/:id', authenticate, deletePlan);
router.get('/:id/export', authenticate, exportPlan);

module.exports = router;
