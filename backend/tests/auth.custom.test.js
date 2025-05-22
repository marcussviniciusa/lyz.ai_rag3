/**
 * Testes personalizados para autenticau00e7u00e3o sem dependu00eancia do MongoDB Memory Server
 */

// Configurar variu00e1veis de ambiente para testes
process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_REFRESH_SECRET = 'test-refresh-key';
process.env.JWT_EXPIRES_IN = '15m';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';
process.env.NODE_ENV = 'test';

// Configurar todos os mocks antes de importar os mu00f3dulos
jest.mock('../src/models/user.model', () => ({
  findById: jest.fn().mockImplementation(() => ({
    populate: jest.fn()
  }))
}));

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
  sign: jest.fn()
}));

jest.mock('../src/utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn()
}));

// Importar os mu00f3dulos depois de configurar os mocks
const { authenticate, authorize } = require('../src/middleware/auth');
const jwt = require('jsonwebtoken');
const User = require('../src/models/user.model');

// Banco de dados em memu00f3ria para testes
const mockDB = {
  users: [
    {
      _id: 'user-123',
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashed_password123',
      role: 'admin',
      active: true,
      company_id: 'company-123'
    },
    {
      _id: 'user-456',
      name: 'Inactive User',
      email: 'inactive@example.com',
      password: 'hashed_password456',
      role: 'user',
      active: false,
      company_id: 'company-123'
    }
  ],
  companies: [
    {
      _id: 'company-123',
      name: 'Test Company',
      active: true
    }
  ]
};

// Testes para o middleware de autenticau00e7u00e3o
describe('Auth Middleware', () => {
  // Testes para o middleware authenticate
  describe('authenticate middleware', () => {
    let req, res, next;

    beforeEach(() => {
      // Reset dos mocks
      jest.clearAllMocks();
      
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
      jwt.verify.mockImplementationOnce(() => {
        throw new Error('Invalid token');
      });
      
      await authenticate(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false
      }));
    });

    test('deve retornar erro 401 quando o token estiver expirado', async () => {
      req.headers.authorization = 'Bearer expired-token';
      jwt.verify.mockImplementationOnce(() => {
        const err = new Error('Token expired');
        err.name = 'TokenExpiredError';
        throw err;
      });
      
      await authenticate(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false
      }));
    });

    test('deve retornar erro 404 quando o usuu00e1rio nu00e3o for encontrado', async () => {
      req.headers.authorization = 'Bearer valid-token';
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
      req.headers.authorization = 'Bearer valid-token';
      jwt.verify.mockImplementationOnce(() => ({ id: 'user-456' }));
      
      // Precisamos simular o comportamento completo do método populate()
      const mockPopulate = jest.fn().mockResolvedValueOnce({
        _id: 'user-456',
        name: 'Inactive User',
        email: 'inactive@example.com',
        role: 'user',
        active: false,
        company_id: 'company-123'
      });
      
      User.findById.mockImplementationOnce(() => ({
        populate: mockPopulate
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
      
      // Criar um objeto de usuário completo para teste
      const mockUserObj = {
        _id: 'user-123',
        name: 'Test User',
        email: 'test@example.com',
        role: 'admin',
        active: true,
        company_id: 'company-123'
      };
      
      // Implementar o comportamento esperado corretamente
      const mockPopulate = jest.fn().mockResolvedValueOnce(mockUserObj);
      User.findById.mockImplementationOnce(() => ({
        populate: mockPopulate
      }));
      
      await authenticate(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(req.user).toEqual(mockUserObj);
    });
  });

  // Testes para o middleware authorize
  describe('authorize middleware', () => {
    let req, res, next;

    beforeEach(() => {
      // Reset dos mocks
      jest.clearAllMocks();
      
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
