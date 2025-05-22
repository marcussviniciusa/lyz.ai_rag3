const express = require('express');
const { getCompanies, getCompany, createCompany, updateCompany, deleteCompany } = require('../controllers/company.controller');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Rotas protegidas - apenas superadmins podem acessar
router.get('/', authenticate, authorize('superadmin'), getCompanies);
router.get('/:id', authenticate, authorize('superadmin'), getCompany);
router.post('/', authenticate, authorize('superadmin'), createCompany);
router.put('/:id', authenticate, authorize('superadmin'), updateCompany);
router.delete('/:id', authenticate, authorize('superadmin'), deleteCompany);

module.exports = router;
