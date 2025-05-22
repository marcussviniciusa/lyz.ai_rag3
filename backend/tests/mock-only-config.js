/**
 * Configurau00e7u00e3o simplificada para testes sem MongoDB Memory Server
 * Esta abordagem evita problemas com dependu00eancias do sistema como libcrypto.so.1.1
 */

// Configurar variu00e1veis de ambiente para testes
process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_REFRESH_SECRET = 'test-refresh-key';
process.env.JWT_EXPIRES_IN = '15m';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';
process.env.NODE_ENV = 'test';

// Banco de dados em memu00f3ria simples para testes
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

// Mock do modelo User
const mockUserModel = {
  findOne: jest.fn().mockImplementation((query) => {
    const user = mockDB.users.find(u => {
      if (query.email) return u.email === query.email;
      if (query._id) return u._id === query._id;
      return false;
    });
    return Promise.resolve(user);
  }),
  findById: jest.fn().mockImplementation((id) => {
    return {
      populate: jest.fn().mockImplementation(() => {
        const user = mockDB.users.find(u => u._id === id);
        if (user && user.company_id) {
          const company = mockDB.companies.find(c => c._id === user.company_id);
          if (company) {
            const populatedUser = { ...user };
            populatedUser.company_id = { ...company };
            return Promise.resolve(populatedUser);
          }
        }
        return Promise.resolve(user);
      })
    };
  }),
  create: jest.fn().mockImplementation((data) => {
    const newUser = { ...data, _id: data._id || `user-${Date.now()}` };
    mockDB.users.push(newUser);
    return Promise.resolve(newUser);
  })
};

// Aplicar mocks globais
jest.mock('../../src/models/user.model', () => mockUserModel, { virtual: true });

// Mocks para JWT
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockImplementation((payload, secret, options) => {
    return 'mocked-jwt-token';
  }),
  verify: jest.fn().mockImplementation((token, secret) => {
    if (token === 'invalid-token') {
      throw new Error('Invalid token');
    }
    if (token === 'expired-token') {
      const err = new Error('Token expired');
      err.name = 'TokenExpiredError';
      throw err;
    }
    return { id: 'user-123' };
  })
}));

// Suprimir logs durante testes
jest.mock('../../src/utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn()
}));

// Adicionar funu00e7u00f5es auxiliares ao escopo global para uso nos testes
global.mockDB = mockDB;

// Resetar mocks antes de cada teste
beforeEach(() => {
  jest.clearAllMocks();
});
