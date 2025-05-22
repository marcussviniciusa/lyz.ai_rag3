/**
 * Testes para a versu00e3o do middleware de autenticau00e7u00e3o amigu00e1vel a testes
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

// Mock do User model - importante criar um mock que possa ser recriado em cada teste
jest.mock('../src/models/user.model', () => ({
  findById: jest.fn().mockImplementation(() => ({
    populate: jest.fn()
  }))
}));

// Mock do logger
jest.mock('../src/utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn()
}));

// Importau00e7u00f5es depois dos mocks
const jwt = require('jsonwebtoken');
const User = require('../src/models/user.model');
const { authenticate, authorize } = require('../src/middleware/auth.test-friendly');

describe('Auth Middleware (Test-friendly version)', () => {
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
    active: false, // Este valor é crucial para o teste
    company_id: { _id: 'company-123', name: 'Test Company' }
  };
  
  // Setup para cada teste
  let req, res, next;
  
  beforeEach(() => {
    // Reset dos mocks
    jest.clearAllMocks();
    
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
      
      // Simular erro de token invu00e1lido
      jwt.verify.mockImplementation(() => {
        throw new Error('Token invu00e1lido');
      });
      
      await authenticate(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });
    
    test('deve retornar erro 404 quando usuu00e1rio nu00e3o encontrado', async () => {
      req.headers.authorization = 'Bearer valid-token';
      
      // Simular token vu00e1lido
      jwt.verify.mockReturnValue({ id: 'non-existent-id' });
      
      // Simular usuu00e1rio nu00e3o encontrado
      const mockPopulate = jest.fn().mockResolvedValue(null);
      User.findById.mockReturnValue({ populate: mockPopulate });
      
      await authenticate(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(next).not.toHaveBeenCalled();
    });
    
    test('deve retornar erro 403 quando usuu00e1rio estiver inativo', async () => {
      req.headers.authorization = 'Bearer valid-token';
      
      // Simular token vu00e1lido
      jwt.verify.mockReturnValue({ id: 'inactive-user-id' });
      
      // Simular usuu00e1rio inativo - usaremos um objeto com active=false explicitamente
      const inactiveUser = {
        _id: 'inactive-user-id',
        name: 'Inactive User',
        email: 'inactive@example.com',
        role: 'user',
        active: false, // Este valor deve ser exatamente false
        company_id: { _id: 'company-123', name: 'Test Company' }
      };
      
      // Configurar o mock para ESTE teste especu00edfico
      const mockPopulate = jest.fn().mockResolvedValue(inactiveUser);
      User.findById.mockReturnValueOnce({ populate: mockPopulate });
      
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
      
      // Simular usuu00e1rio ativo - usar um objeto explicitamente definido
      const activeUser = {
        _id: 'active-user-id',
        name: 'Active User',
        email: 'active@example.com',
        role: 'admin',
        active: true, // Este valor deve ser exatamente true
        company_id: { _id: 'company-123', name: 'Test Company' }
      };
      
      // Configurar o mock para retornar o usuu00e1rio ativo NESTE teste especu00edfico
      const mockPopulate = jest.fn().mockResolvedValue(activeUser);
      User.findById.mockReturnValueOnce({ populate: mockPopulate });
      
      await authenticate(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(req.user).toEqual(activeUser);
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
