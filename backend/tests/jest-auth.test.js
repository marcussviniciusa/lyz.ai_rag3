/**
 * Testes finais para autenticau00e7u00e3o - versu00e3o simplificada
 * Esta abordagem usa jest.spyOn para facilitar o mock das funu00e7u00f5es
 */

// Configurau00e7u00e3o do ambiente de testes
process.env.JWT_SECRET = 'test-secret';
process.env.JWT_EXPIRES_IN = '1h';
process.env.NODE_ENV = 'test';

// Mock do mongoose ANTES de qualquer importau00e7u00e3o
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
    model: jest.fn().mockReturnValue({
      findById: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      })
    })
  };
});

// Imports necessu00e1rios
const jwt = require('jsonwebtoken');
const User = require('../src/models/user.model');
const { authenticate, authorize } = require('../src/middleware/auth.test-friendly');

// Mock do logger para evitar logs durante os testes
jest.mock('../src/utils/logger', () => ({
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn()
}));

describe('Auth Middleware (Jest spy version)', () => {
  // Mock dos objetos request, response e next
  let req, res, next;
  
  // Dados de teste
  const mockActiveUser = {
    _id: 'active-user-id',
    name: 'Test User',
    email: 'test@example.com',
    active: true,
    role: 'admin',
    company_id: { _id: 'company-123', name: 'Test Company' }
  };
  
  const mockInactiveUser = {
    _id: 'inactive-user-id',
    name: 'Inactive User',
    email: 'inactive@example.com',
    active: false,
    role: 'user',
    company_id: { _id: 'company-123', name: 'Test Company' }
  };
  
  beforeEach(() => {
    // Reset dos mocks entre os testes
    jest.clearAllMocks();
    
    // Configurau00e7u00e3o dos objetos para cada teste
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    
    // Mock do jwt.verify
    jest.spyOn(jwt, 'verify');
    
    // Preparamos um mock do User.findById que retorna um objeto com mu00e9todo populate
    const mockUserFindById = jest.fn().mockReturnValue({
      populate: jest.fn()
    });
    
    // Substituir o mu00e9todo findById original pelo mock
    jest.spyOn(User, 'findById').mockImplementation(mockUserFindById);
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
      
      // Simular erro na verificau00e7u00e3o do token
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
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
      const mockPopulateFn = jest.fn().mockResolvedValue(null);
      User.findById().populate.mockImplementation(mockPopulateFn);
      
      await authenticate(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(next).not.toHaveBeenCalled();
    });
    
    test('deve retornar erro 403 quando usuu00e1rio estiver inativo', async () => {
      req.headers.authorization = 'Bearer valid-token';
      
      // Simular token vu00e1lido
      jwt.verify.mockReturnValue({ id: 'inactive-user-id' });
      
      // Simular usuu00e1rio inativo
      const mockPopulateFn = jest.fn().mockResolvedValue(mockInactiveUser);
      User.findById().populate.mockImplementation(mockPopulateFn);
      
      await authenticate(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });
    
    test('deve chamar next() quando autenticado com sucesso', async () => {
      req.headers.authorization = 'Bearer valid-token';
      
      // Simular token vu00e1lido
      jwt.verify.mockReturnValue({ id: 'active-user-id' });
      
      // Simular usuu00e1rio ativo
      const mockPopulateFn = jest.fn().mockResolvedValue(mockActiveUser);
      User.findById().populate.mockImplementation(mockPopulateFn);
      
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
