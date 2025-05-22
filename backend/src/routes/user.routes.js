const express = require('express');
const { getUsers, getUser, createUser, updateUser, deleteUser } = require('../controllers/user.controller');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Rotas para superadmin - gerenciamento completo de usuu00e1rios
router.get('/', authenticate, authorize('superadmin'), getUsers);
router.post('/', authenticate, authorize('superadmin'), createUser);
router.get('/:id', authenticate, authorize('superadmin'), getUser);
router.put('/:id', authenticate, authorize('superadmin'), updateUser);
router.delete('/:id', authenticate, authorize('superadmin'), deleteUser);

// Rota para perfil do usuu00e1rio atual
router.get('/profile/me', authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user
  });
});

// Rota para atualizau00e7u00e3o de senha do usuu00e1rio atual
router.put('/profile/password', authenticate, (req, res) => {
  // Esta rota seru00e1 implementada no controlador de usuu00e1rios
  updatePassword(req, res);
});

module.exports = router;
