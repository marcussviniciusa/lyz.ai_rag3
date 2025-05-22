/**
 * Testes simplificados de autenticau00e7u00e3o sem depender do MongoDB Memory Server
 */

// Configurar as variu00e1veis de ambiente
process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key';
process.env.JWT_EXPIRES_IN = '15m';

// Definir mocks diretamente
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn()
}));

jest.mock('../src/models/user.model', () => ({
  findById: jest.fn().mockReturnValue({
    populate: jest.fn()
  })
}));

jest.mock('../src/utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn()
}));

// Importar dependu00eancias depois de configurar os mocks
const jwt = require('jsonwebtoken');
const User = require('../src/models/user.model');

// Dados de teste
const mockUsers = [
  {
    _id: 'user-123',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashed_password123',
    role: 'admin',
    active: true,
    company_id: { _id: 'company-123', name: 'Test Company' }
  },
  {
    _id: 'user-456',
    name: 'Inactive User',
    email: 'inactive@example.com',
    password: 'hashed_password456',
    role: 'user',
    active: false,
    company_id: { _id: 'company-123', name: 'Test Company' }
  }
];

// Importar o middleware de autenticau00e7u00e3o
const { authenticate, authorize } = require('../src/middleware/auth');

describe('Auth Middleware Tests', () => {
  let req, res, next;

  beforeEach(() => {
    // Reset dos mocks
    jest.clearAllMocks();
    
    // Configurar os mocks para cada teste
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
      jwt.verify.mockImplementationOnce(() => {
        throw new Error('Token invu00e1lido');
      });
      
      await authenticate(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    test('deve retornar erro 404 quando usuu00e1rio nu00e3o encontrado', async () => {
      req.headers.authorization = 'Bearer valid-token';
      jwt.verify.mockReturnValueOnce({ id: 'nonexistent-user' });
      User.findById().populate.mockResolvedValueOnce(null);
      
      await authenticate(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(next).not.toHaveBeenCalled();
    });

    test('deve retornar erro 403 quando usuu00e1rio estiver inativo', async () => {
      req.headers.authorization = 'Bearer valid-token';
      jwt.verify.mockReturnValueOnce({ id: 'user-456' });
      User.findById().populate.mockResolvedValueOnce(mockUsers[1]); // Usuu00e1rio inativo
      
      await authenticate(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });

    test('deve chamar next() e adicionar usuu00e1rio u00e0 requisiu00e7u00e3o quando autenticado com sucesso', async () => {
      req.headers.authorization = 'Bearer valid-token';
      jwt.verify.mockReturnValueOnce({ id: 'user-123' });
      User.findById().populate.mockResolvedValueOnce(mockUsers[0]); // Usuu00e1rio ativo
      
      await authenticate(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(req.user).toEqual(mockUsers[0]);
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
