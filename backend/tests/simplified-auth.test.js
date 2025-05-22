/**
 * Testes simplificados de autenticau00e7u00e3o
 * Esta abordagem usa mocks diretos e sem complicau00e7u00f5es
 */

// PRIMEIRO: Mock do mongoose antes de qualquer importau00e7u00e3o
jest.mock('mongoose', () => {
  const mSchema = function() {
    return {
      pre: jest.fn().mockReturnThis(),
      methods: {},
      statics: {}
    };
  };
  
  mSchema.Types = {
    ObjectId: String,
    String: String,
    Number: Number,
    Boolean: Boolean,
    Array: Array
  };
  
  return {
    Schema: mSchema,
    model: jest.fn()
  };
});

// Configurau00e7u00e3o do ambiente
process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_EXPIRES_IN = '1h';

// Outros mocks
jest.mock('jsonwebtoken');
jest.mock('../src/models/user.model', () => ({
  findById: jest.fn()
}));
jest.mock('../src/utils/logger', () => ({
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn()
}));

// Imports
const jwt = require('jsonwebtoken');
const User = require('../src/models/user.model');
const { authenticate, authorize } = require('../src/middleware/auth.testing');

describe('Auth Middleware Tests', () => {
  // Dados de teste
  const mockActiveUser = {
    _id: 'active-user-id',
    name: 'Active User',
    email: 'test@example.com',
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
  
  // Setup para cada teste
  let req, res, next;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup padru00e3o
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
      
      jwt.verify.mockReturnValue({ id: 'user-id' });
      User.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });
      
      await authenticate(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(next).not.toHaveBeenCalled();
    });
    
    test('deve retornar erro 403 quando usuu00e1rio estiver inativo', async () => {
      req.headers.authorization = 'Bearer valid-token';
      
      jwt.verify.mockReturnValue({ id: 'inactive-user-id' });
      User.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockInactiveUser)
      });
      
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
      User.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockActiveUser)
      });
      
      await authenticate(req, res, next);
      
      expect(next).toHaveBeenCalled();
      expect(req.user).toEqual(mockActiveUser);
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
