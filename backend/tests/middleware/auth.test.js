/**
 * Testes para o middleware de autenticau00e7u00e3o
 */

const jwt = require('jsonwebtoken');
const { authenticate, authorize } = require('../../src/middleware/auth');
const User = require('../../src/models/user.model');

// Mock do mu00f3dulo JWT
jest.mock('jsonwebtoken');

// Mock do mu00f3dulo de logger
jest.mock('../../src/utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn()
}));

// Mock para o modelo User
jest.mock('../../src/models/user.model', () => {
  return {
    findById: jest.fn().mockImplementation(() => ({
      populate: jest.fn()
    }))
  };
});

describe('Auth Middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    // Reset dos mocks
    jest.clearAllMocks();
  });

  beforeEach(() => {
    // Reset dos mocks
    jest.clearAllMocks();
    
    // Mock dos objetos request, response e next
    req = {
      headers: {},
      user: null
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    next = jest.fn();
    
    // Configurau00e7u00e3o inicial do mock de JWT
    jwt.verify.mockReset();
    
    // Mock de busca de usuu00e1rio
    User.findById.mockReset();
    User.findById.mockImplementation(() => ({
      populate: jest.fn().mockResolvedValue(null)
    }));
  });

  describe('authenticate middleware', () => {
    it('deve retornar erro 401 quando nu00e3o fornecido token de autorizau00e7u00e3o', async () => {
      // Requisiu00e7u00e3o sem header de autorizau00e7u00e3o
      await authenticate(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: expect.stringContaining('Token nu00e3o fornecido')
      }));
      expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar erro 401 quando o formato do token for invu00e1lido', async () => {
      // Header de autorizau00e7u00e3o sem o prefixo Bearer
      req.headers.authorization = 'InvalidToken';
      
      await authenticate(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: expect.stringContaining('Token nu00e3o fornecido')
      }));
      expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar erro 401 quando o token for invu00e1lido', async () => {
      // Header com token, mas JWT.verify falha
      req.headers.authorization = 'Bearer invalid-token';
      jwt.verify.mockImplementation(() => {
        throw new jwt.JsonWebTokenError('Token invu00e1lido');
      });
      
      await authenticate(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: expect.stringContaining('Token invu00e1lido')
      }));
      expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar erro 401 quando o token estiver expirado', async () => {
      // Header com token, mas JWT.verify indica expirado
      req.headers.authorization = 'Bearer expired-token';
      jwt.verify.mockImplementation(() => {
        throw new jwt.TokenExpiredError('Token expirado');
      });
      
      await authenticate(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: expect.stringContaining('Token invu00e1lido ou expirado')
      }));
      expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar erro 404 quando o usuu00e1rio nu00e3o for encontrado', async () => {
      // Token vu00e1lido, mas usuu00e1rio nu00e3o encontrado
      req.headers.authorization = 'Bearer valid-token';
      
      // JWT.verify retorna um payload vu00e1lido
      jwt.verify.mockReturnValue({ id: '60d21b4667d0d8992e610c85' });
      
      // User.findById retorna null (usuu00e1rio nu00e3o encontrado)
      User.findById.mockImplementation(() => ({
        populate: jest.fn().mockResolvedValue(null)
      }));
      
      await authenticate(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: expect.stringContaining('Usuu00e1rio nu00e3o encontrado')
      }));
      expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar erro 403 quando o usuu00e1rio estiver inativo', async () => {
      // Token vu00e1lido, mas usuu00e1rio inativo
      req.headers.authorization = 'Bearer valid-token';
      
      // JWT.verify retorna um payload vu00e1lido
      jwt.verify.mockReturnValue({ id: '60d21b4667d0d8992e610c85' });
      
      // User.findById retorna um usuu00e1rio inativo
      const mockUser = {
        _id: '60d21b4667d0d8992e610c85',
        name: 'Usuu00e1rio Teste',
        email: 'usuario.teste@example.com',
        role: 'user',
        active: false,
        company_id: { _id: '60d21b4667d0d8992e610c86', name: 'Empresa Teste' }
      };
      
      User.findById.mockImplementation(() => ({
        populate: jest.fn().mockResolvedValue(mockUser)
      }));
      
      await authenticate(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: expect.stringContaining('Usuu00e1rio inativo')
      }));
      expect(next).not.toHaveBeenCalled();
    });

    it('deve chamar next() e adicionar usuu00e1rio u00e0 requisiu00e7u00e3o quando autenticado com sucesso', async () => {
      // Token vu00e1lido e usuu00e1rio encontrado
      req.headers.authorization = 'Bearer valid-token';
      
      // JWT.verify retorna um payload vu00e1lido
      jwt.verify.mockReturnValue({ id: '60d21b4667d0d8992e610c85' });
      
      // User.findById retorna um usuu00e1rio ativo
      const mockUser = {
        _id: '60d21b4667d0d8992e610c85',
        name: 'Usuu00e1rio Teste',
        email: 'usuario.teste@example.com',
        role: 'user',
        active: true,
        company_id: { _id: '60d21b4667d0d8992e610c86', name: 'Empresa Teste' }
      };
      
      User.findById.mockImplementation(() => ({
        populate: jest.fn().mockResolvedValue(mockUser)
      }));
      
      await authenticate(req, res, next);
      
      expect(req.user).toEqual(mockUser);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('authorize middleware', () => {
    it('deve retornar erro 401 quando usuu00e1rio nu00e3o estiver autenticado', () => {
      // Middleware de autorizau00e7u00e3o para role 'admin'
      const authMiddleware = authorize('admin');
      
      // Req sem usuu00e1rio (nu00e3o autenticado)
      req.user = null;
      
      authMiddleware(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: expect.stringContaining('Usuu00e1rio nu00e3o autenticado')
      }));
      expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar erro 403 quando usuu00e1rio nu00e3o tiver a role necessu00e1ria', () => {
      // Middleware de autorizau00e7u00e3o para role 'admin'
      const authMiddleware = authorize('admin');
      
      // Usuu00e1rio com role diferente
      req.user = { role: 'user' };
      
      authMiddleware(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: expect.stringContaining('Acesso proibido')
      }));
      expect(next).not.toHaveBeenCalled();
    });

    it('deve chamar next() quando usuu00e1rio tiver a role necessu00e1ria', () => {
      // Middleware de autorizau00e7u00e3o para role 'admin'
      const authMiddleware = authorize('admin');
      
      // Usuu00e1rio com a role correta
      req.user = { role: 'admin' };
      
      authMiddleware(req, res, next);
      
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});
