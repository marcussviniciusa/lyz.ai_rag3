/**
 * Mock completo para Mongoose
 * Isso evita a necessidade de usar mongodb-memory-server
 */

// Mock de dados para os modelos
const mockData = {
  users: [],
  companies: []
};

// Mock do Document do Mongoose
class MockDocument {
  constructor(data) {
    Object.assign(this, data);
    this._id = data._id || `mock-id-${Date.now()}`;
  }

  save() {
    return Promise.resolve(this);
  }
}

// Mock para o model User
const UserMock = {
  findOne: jest.fn().mockImplementation((query) => {
    const user = mockData.users.find(u => {
      if (query.email) return u.email === query.email;
      if (query._id) return u._id.toString() === query._id.toString();
      return false;
    });
    return Promise.resolve(user ? new MockDocument(user) : null);
  }),
  findById: jest.fn().mockImplementation((id) => {
    return {
      populate: jest.fn().mockImplementation(() => {
        const user = mockData.users.find(u => u._id.toString() === id.toString());
        if (user && user.company_id) {
          const company = mockData.companies.find(c => c._id.toString() === user.company_id.toString());
          if (company) {
            user.company_id = company;
          }
        }
        return Promise.resolve(user ? new MockDocument(user) : null);
      })
    };
  }),
  create: jest.fn().mockImplementation((data) => {
    const newUser = new MockDocument(data);
    mockData.users.push(newUser);
    return Promise.resolve(newUser);
  }),
  findByIdAndUpdate: jest.fn().mockImplementation((id, update) => {
    const index = mockData.users.findIndex(u => u._id.toString() === id.toString());
    if (index !== -1) {
      mockData.users[index] = { ...mockData.users[index], ...update };
      return Promise.resolve(new MockDocument(mockData.users[index]));
    }
    return Promise.resolve(null);
  })
};

// Mock para o model Company
const CompanyMock = {
  findOne: jest.fn().mockImplementation((query) => {
    const company = mockData.companies.find(c => {
      if (query.name) return c.name === query.name;
      if (query._id) return c._id.toString() === query._id.toString();
      return false;
    });
    return Promise.resolve(company ? new MockDocument(company) : null);
  }),
  findById: jest.fn().mockImplementation((id) => {
    const company = mockData.companies.find(c => c._id.toString() === id.toString());
    return Promise.resolve(company ? new MockDocument(company) : null);
  }),
  create: jest.fn().mockImplementation((data) => {
    const newCompany = new MockDocument(data);
    mockData.companies.push(newCompany);
    return Promise.resolve(newCompany);
  })
};

// Funções auxiliares para teste
const clearMockData = () => {
  mockData.users = [];
  mockData.companies = [];
};

const addMockUser = (userData) => {
  const user = new MockDocument(userData);
  mockData.users.push(user);
  return user;
};

const addMockCompany = (companyData) => {
  const company = new MockDocument(companyData);
  mockData.companies.push(company);
  return company;
};

// Criau00e7u00e3o do mock principal do Mongoose
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
  model: jest.fn().mockImplementation((name) => {
    if (name === 'User') return UserMock;
    if (name === 'Company') return CompanyMock;
    return {};
  }),
  Types: {
    ObjectId: jest.fn().mockImplementation((id) => id || `mock-id-${Math.random().toString(36).substring(7)}`)
  }
};

// Exporta o mock do mongoose, nu00e3o os modelos individualmente
module.exports = mongoose;

// Exporta tambu00e9m as funu00e7u00f5es auxiliares e modelos para uso direto nos testes
module.exports.models = {
  UserMock,
  CompanyMock
};

module.exports.utils = {
  clearMockData,
  addMockUser,
  addMockCompany,
  mockData
};
