/**
 * Script para executar os testes de autenticau00e7u00e3o sem MongoDB Memory Server
 */

// Importar a configurau00e7u00e3o de mock
require('./mock-only-config');

// Importar e executar os testes
const { authenticate, authorize } = require('../src/middleware/auth');
const User = require('../src/models/user.model');
const jwt = require('jsonwebtoken');

// Testar o middleware de autenticau00e7u00e3o
describe('Testes de Autenticau00e7u00e3o', () => {
  // Testes para o middleware authenticate
  describe('authenticate middleware', () => {
    let req, res, next;

    beforeEach(() => {
      // Configurar mocks para req, res e next
      req = {
        headers: {}
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      next = jest.fn();
    });

    test('deve retornar erro 401 quando nu00e3o fornecido token de autorizau00e7u00e3o', async () => {
      await authenticate(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false
      }));
    });

    test('deve retornar erro 401 quando o formato do token for invu00e1lido', async () => {
      req.headers.authorization = 'Invalid-format';
      await authenticate(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false
      }));
    });

    test('deve retornar erro 401 quando o token for invu00e1lido', async () => {
      req.headers.authorization = 'Bearer invalid-token';
      await authenticate(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false
      }));
    });

    test('deve retornar erro 401 quando o token estiver expirado', async () => {
      req.headers.authorization = 'Bearer expired-token';
      await authenticate(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false
      }));
    });

    test('deve retornar erro 404 quando o usuu00e1rio nu00e3o for encontrado', async () => {
      req.headers.authorization = 'Bearer valid-token-nonexistent-user';
      jwt.verify.mockImplementationOnce(() => ({ id: 'nonexistent-user' }));
      User.findById.mockImplementationOnce(() => ({
        populate: jest.fn().mockResolvedValueOnce(null)
      }));
      
      await authenticate(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false
      }));
    });

    test('deve retornar erro 403 quando o usuu00e1rio estiver inativo', async () => {
      req.headers.authorization = 'Bearer valid-token-inactive-user';
      jwt.verify.mockImplementationOnce(() => ({ id: 'user-456' }));
      User.findById.mockImplementationOnce(() => ({
        populate: jest.fn().mockResolvedValueOnce(mockDB.users[1])
      }));
      
      await authenticate(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false
      }));
    });

    test('deve chamar next() e adicionar usuu00e1rio u00e0 requisiu00e7u00e3o quando autenticado com sucesso', async () => {
      req.headers.authorization = 'Bearer valid-token';
      jwt.verify.mockImplementationOnce(() => ({ id: 'user-123' }));
      User.findById.mockImplementationOnce(() => ({
        populate: jest.fn().mockResolvedValueOnce(mockDB.users[0])
      }));
      
      await authenticate(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(req.user).toEqual(mockDB.users[0]);
    });
  });

  // Testes para o middleware authorize
  describe('authorize middleware', () => {
    let req, res, next;

    beforeEach(() => {
      req = {};
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      next = jest.fn();
    });

    test('deve retornar erro 401 quando usuu00e1rio nu00e3o estiver autenticado', () => {
      const authMiddleware = authorize('admin');
      authMiddleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false
      }));
    });

    test('deve retornar erro 403 quando usuu00e1rio nu00e3o tiver a role necessu00e1ria', () => {
      req.user = { role: 'user' };
      const authMiddleware = authorize('admin');
      authMiddleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false
      }));
    });

    test('deve chamar next() quando usuu00e1rio tiver a role necessu00e1ria', () => {
      req.user = { role: 'admin' };
      const authMiddleware = authorize('admin');
      authMiddleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
