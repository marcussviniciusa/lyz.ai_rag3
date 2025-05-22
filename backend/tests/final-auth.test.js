/**
 * Testes finais de autenticau00e7u00e3o
 */

// Mock do mongoose antes de qualquer importau00e7u00e3o
jest.mock('mongoose', () => ({
  Schema: {
    Types: {
      ObjectId: String
    }
  },
  model: jest.fn().mockReturnValue({})
}));

// Mock do JWT
jest.mock('jsonwebtoken');

// Mock do User model
jest.mock('../src/models/user.model', () => ({
  findById: jest.fn().mockReturnValue({
    populate: jest.fn()
  })
}));

// Mock do logger
jest.mock('../src/utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn()
}));

describe('Auth Middleware', () => {
  // Importau00e7u00f5es depois dos mocks
  const jwt = require('jsonwebtoken');
  const User = require('../src/models/user.model');
  const { authenticate, authorize } = require('../src/middleware/auth');
  
  // Dados de teste
  const mockActiveUser = {
    _id: 'user-123',
    name: 'Test User',
    email: 'test@example.com',
    role: 'admin',
    active: true,
    company_id: { _id: 'company-123', name: 'Test Company' }
  };
  
  const mockInactiveUser = {
    _id: 'user-456',
    name: 'Inactive User',
    email: 'inactive@example.com',
    role: 'user',
    active: false,
    company_id: { _id: 'company-123', name: 'Test Company' }
  };
  
  // Setup para cada teste
  let req, res, next;
  
  beforeEach(() => {
    // Mock as funu00e7u00f5es do JWT e do User model diretamente
    jest.clearAllMocks();
    jwt.verify = jest.fn();
    User.findById = jest.fn();
    
    // Configurar objetos req, res e next
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
    });
    
    test('deve retornar erro 401 quando formato do token for invu00e1lido', async () => {
      req.headers.authorization = 'InvalidFormat';
      await authenticate(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
    });
    
    test('deve retornar erro 401 quando token for invu00e1lido', async () => {
      req.headers.authorization = 'Bearer invalid-token';
      
      // Simular erro de token invu00e1lido
      jwt.verify.mockImplementation(() => {
        throw new Error('Token invu00e1lido');
      });
      
      await authenticate(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
    });
    
    test('deve retornar erro 404 quando usuu00e1rio nu00e3o encontrado', async () => {
      req.headers.authorization = 'Bearer valid-token';
      
      // Simular token vu00e1lido
      jwt.verify.mockReturnValue({ id: 'non-existent-id' });
      
      // Simular usuu00e1rio nu00e3o encontrado
      const mockPopulateFn = jest.fn().mockResolvedValue(null);
      User.findById.mockReturnValue({ populate: mockPopulateFn });
      
      await authenticate(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
    });
    
    test('deve retornar erro 403 quando usuu00e1rio estiver inativo', async () => {
      req.headers.authorization = 'Bearer valid-token';
      
      // Simular token vu00e1lido
      jwt.verify.mockReturnValue({ id: 'inactive-user-id' });
      
      // Simular usuu00e1rio inativo
      const mockPopulateFn = jest.fn().mockResolvedValue(mockInactiveUser);
      User.findById.mockReturnValue({ populate: mockPopulateFn });
      
      await authenticate(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: expect.stringContaining('inativo')
      }));
    });
    
    test('deve chamar next() quando autenticado com sucesso', async () => {
      req.headers.authorization = 'Bearer valid-token';
      
      // Simular token vu00e1lido
      jwt.verify.mockReturnValue({ id: 'active-user-id' });
      
      // Simular usuu00e1rio ativo
      const mockPopulateFn = jest.fn().mockResolvedValue(mockActiveUser);
      User.findById.mockReturnValue({ populate: mockPopulateFn });
      
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
