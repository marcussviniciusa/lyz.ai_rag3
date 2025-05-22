/**
 * Configurau00e7u00e3o global para testes Jest no backend
 */

// Configurar variu00e1veis de ambiente para testes
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
process.env.JWT_EXPIRES_IN = '15m';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';
process.env.NODE_ENV = 'test';

// Banco de dados em memu00f3ria para testes
const mockDb = {
  users: [],
  companies: []
};

// Mock do Mongoose
jest.mock('mongoose', () => {
  const mongoose = {
    connect: jest.fn().mockResolvedValue(true),
    connection: {
      readyState: 1,
      once: jest.fn(),
      on: jest.fn()
    },
    Schema: jest.fn().mockImplementation(() => ({
      pre: jest.fn().mockReturnThis(),
      methods: {},
      statics: {},
      virtual: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis()
    })),
    model: jest.fn().mockReturnValue({}),
    Types: {
      ObjectId: jest.fn().mockImplementation((id) => id || 'mock-id-' + Math.random().toString(36).substring(7))
    }
  };
  return mongoose;
});

// Mock do modelo User
jest.mock('./src/models/user.model', () => {
  return {
    findOne: jest.fn().mockImplementation((query) => {
      const user = mockDb.users.find(u => {
        if (query.email) return u.email === query.email;
        if (query._id) return u._id === query._id;
        return false;
      });
      return Promise.resolve(user);
    }),
    findById: jest.fn().mockImplementation((id) => {
      return {
        populate: jest.fn().mockImplementation(() => {
          const user = mockDb.users.find(u => u._id === id);
          if (user && user.company_id) {
            const company = mockDb.companies.find(c => c._id === user.company_id);
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
      const newUser = { 
        ...data, 
        _id: data._id || 'user-' + Math.random().toString(36).substring(7) 
      };
      mockDb.users.push(newUser);
      return Promise.resolve(newUser);
    }),
    findByIdAndUpdate: jest.fn().mockImplementation((id, update) => {
      const index = mockDb.users.findIndex(u => u._id === id);
      if (index >= 0) {
        mockDb.users[index] = { ...mockDb.users[index], ...update };
        return Promise.resolve(mockDb.users[index]);
      }
      return Promise.resolve(null);
    })
  };
});

// Mock do modelo Company
jest.mock('./src/models/company.model', () => {
  return {
    findOne: jest.fn().mockImplementation((query) => {
      const company = mockDb.companies.find(c => {
        if (query.name) return c.name === query.name;
        if (query._id) return c._id === query._id;
        return false;
      });
      return Promise.resolve(company);
    }),
    findById: jest.fn().mockImplementation((id) => {
      const company = mockDb.companies.find(c => c._id === id);
      return Promise.resolve(company);
    }),
    create: jest.fn().mockImplementation((data) => {
      const newCompany = { 
        ...data, 
        _id: data._id || 'company-' + Math.random().toString(36).substring(7) 
      };
      mockDb.companies.push(newCompany);
      return Promise.resolve(newCompany);
    })
  };
});

// Limpar todos os mocks antes de cada teste
beforeEach(() => {
  mockDb.users = [];
  mockDb.companies = [];
  jest.clearAllMocks();
});

// Funu00e7u00f5es auxiliares para adicionar dados de teste
global.addTestUser = (userData) => {
  const user = { 
    ...userData, 
    _id: userData._id || 'user-' + Math.random().toString(36).substring(7) 
  };
  mockDb.users.push(user);
  return user;
};

global.addTestCompany = (companyData) => {
  const company = { 
    ...companyData, 
    _id: companyData._id || 'company-' + Math.random().toString(36).substring(7) 
  };
  mockDb.companies.push(company);
  return company;
};

global.mockDb = mockDb;
