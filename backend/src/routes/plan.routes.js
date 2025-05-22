const express = require('express');
const { getPlans, getPlan, createPlan, updatePlan, deletePlan, exportPlan } = require('../controllers/plan.controller');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Rotas protegidas - apenas usuários autenticados podem acessar
router.get('/', authenticate, getPlans);
router.get('/:id', authenticate, getPlan);
router.post('/', authenticate, createPlan);
router.put('/:id', authenticate, updatePlan);
router.delete('/:id', authenticate, deletePlan);
router.get('/:id/export', authenticate, exportPlan);

module.exports = router;
