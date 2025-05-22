/**
 * Testes finais de autenticau00e7u00e3o - versu00e3o simplificada
 * Usando mocks mais diretos para maior estabilidade
 */

// Configurar ambiente de teste
process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_EXPIRES_IN = '1h';

// Mock do mongoose primeiro - deve ser feito antes de importar o modelo
jest.mock('mongoose', () => ({
  Schema: class Schema {
    constructor() { return {} }
    static Types = { ObjectId: String }
    pre() { return this }
  },
  model: jest.fn()
}));

// Mock do User model - use mockUser como prefixo para evitar erros
jest.mock('../src/models/user.model', () => ({
  findById: jest.fn()
}));

// Mock do JWT
jest.mock('jsonwebtoken');

// Mock do logger
jest.mock('../src/utils/logger', () => ({
  error: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  warn: jest.fn()
}));

// Imports
const jwt = require('jsonwebtoken');
const User = require('../src/models/user.model');

// Dados de teste para usuários
const mockActiveUser = {
  _id: 'active-user-id',
  name: 'Active User',
  email: 'active@example.com',
  role: 'admin',
  active: true,
  company_id: { _id: 'company-123', name: 'Test Company' }
};

const mockInactiveUser = {
  _id: 'inactive-user-id',
  name: 'Inactive User',
  email: 'inactive@example.com',
  role: 'user',
  active: false,
  company_id: { _id: 'company-123', name: 'Test Company' }
};

// Middleware de autenticau00e7u00e3o
const { authenticate, authorize } = require('../src/middleware/auth.test-friendly');

describe('Auth Middleware (Versu00e3o Final)', () => {
  // Objetos para testes
  let req, res, next;

  beforeEach(() => {
    // Reset dos mocks
    jest.clearAllMocks();
    
    // Configurau00e7u00e3o padru00e3o
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  describe('authenticate middleware', () => {
    test('deve retornar erro 401 quando token nu00e3o fornecido', async () => {
      await authenticate(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false
      }));
      expect(next).not.toHaveBeenCalled();
    });

    test('deve retornar erro 401 quando formato do token for invu00e1lido', async () => {
      req.headers.authorization = 'InvalidFormat';
      
      await authenticate(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    test('deve retornar erro 401 quando token for invu00e1lido', async () => {
      req.headers.authorization = 'Bearer invalid-token';
      
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });
      
      await authenticate(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    test('deve retornar erro 404 quando usuu00e1rio nu00e3o encontrado', async () => {
      req.headers.authorization = 'Bearer valid-token';
      
      jwt.verify.mockReturnValue({ id: 'non-existent-id' });
      
      // Configurar para retornar null (usuu00e1rio nu00e3o encontrado)
      const populateMock = jest.fn().mockResolvedValue(null);
      User.findById.mockReturnValue({ populate: populateMock });
      
      await authenticate(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(next).not.toHaveBeenCalled();
    });

    test('deve retornar erro 403 quando usuu00e1rio estiver inativo', async () => {
      req.headers.authorization = 'Bearer valid-token';
      
      jwt.verify.mockReturnValue({ id: 'inactive-user-id' });
      
      // Configurar para retornar usuu00e1rio inativo
      const populateMock = jest.fn().mockResolvedValue({
        ...mockInactiveUser,
        active: false // garantir que este valor seja exatamente false
      });
      User.findById.mockReturnValue({ populate: populateMock });
      
      await authenticate(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: expect.stringMatching(/inativo/i)
      }));
      expect(next).not.toHaveBeenCalled();
    });

    test('deve chamar next() quando autenticado com sucesso', async () => {
      req.headers.authorization = 'Bearer valid-token';
      
      jwt.verify.mockReturnValue({ id: 'active-user-id' });
      
      // Configurar para retornar usuu00e1rio ativo
      const populateMock = jest.fn().mockResolvedValue({
        ...mockActiveUser,
        active: true // garantir que este valor seja exatamente true
      });
      User.findById.mockReturnValue({ populate: populateMock });
      
      await authenticate(req, res, next);
      
      expect(next).toHaveBeenCalled();
      expect(req.user).toBeDefined();
      expect(req.user.active).toBe(true);
    });
  });

  describe('authorize middleware', () => {
    test('deve retornar erro 401 quando usuu00e1rio nu00e3o autenticado', () => {
      const authMiddleware = authorize('admin');
      authMiddleware(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    test('deve retornar erro 403 quando usuu00e1rio nu00e3o tem role necessu00e1ria', () => {
      req.user = { role: 'user' };
      const authMiddleware = authorize('admin');
      authMiddleware(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });

    test('deve chamar next() quando usuu00e1rio tem role necessu00e1ria', () => {
      req.user = { role: 'admin' };
      const authMiddleware = authorize('admin');
      authMiddleware(req, res, next);
      
      expect(next).toHaveBeenCalled();
    });
  });
});
