/**
 * Mock para o Mongoose usando jest-mock-extended
 * Esta abordagem evita a necessidade de um MongoDB Memory Server
 */

const { mock } = require('jest-mock-extended');
const mongoose = require('mongoose');

// Dados de teste em memu00f3ria
const mockData = {
  users: [],
  companies: []
};

// Helper para gerar IDs
const generateId = () => mongoose.Types.ObjectId().toString();

// Mock do modelo User
const mockUserModel = {
  findOne: jest.fn().mockImplementation(query => {
    const user = mockData.users.find(u => {
      if (query.email) return u.email === query.email;
      if (query._id) return u._id === query._id;
      return false;
    });
    return Promise.resolve(user);
  }),
  findById: jest.fn().mockImplementation(id => {
    const populateMock = jest.fn().mockImplementation(() => {
      const user = mockData.users.find(u => u._id === id);
      if (user && user.company_id) {
        const company = mockData.companies.find(c => c._id === user.company_id);
        if (company) {
          const populatedUser = { ...user };
          populatedUser.company_id = { ...company };
          return Promise.resolve(populatedUser);
        }
      }
      return Promise.resolve(user);
    });
    
    return { populate: populateMock };
  }),
  create: jest.fn().mockImplementation(data => {
    const newUser = { ...data, _id: data._id || generateId() };
    mockData.users.push(newUser);
    return Promise.resolve(newUser);
  }),
  findByIdAndUpdate: jest.fn().mockImplementation((id, update) => {
    const index = mockData.users.findIndex(u => u._id === id);
    if (index >= 0) {
      mockData.users[index] = { ...mockData.users[index], ...update };
      return Promise.resolve(mockData.users[index]);
    }
    return Promise.resolve(null);
  })
};

// Mock do modelo Company
const mockCompanyModel = {
  findOne: jest.fn().mockImplementation(query => {
    const company = mockData.companies.find(c => {
      if (query.name) return c.name === query.name;
      if (query._id) return c._id === query._id;
      return false;
    });
    return Promise.resolve(company);
  }),
  findById: jest.fn().mockImplementation(id => {
    const company = mockData.companies.find(c => c._id === id);
    return Promise.resolve(company);
  }),
  create: jest.fn().mockImplementation(data => {
    const newCompany = { ...data, _id: data._id || generateId() };
    mockData.companies.push(newCompany);
    return Promise.resolve(newCompany);
  })
};

// Funu00e7u00f5es auxiliares para os testes
const clearMockData = () => {
  mockData.users = [];
  mockData.companies = [];
  Object.values(mockUserModel).forEach(method => {
    if (typeof method === 'function' && method.mockClear) {
      method.mockClear();
    }
  });
  Object.values(mockCompanyModel).forEach(method => {
    if (typeof method === 'function' && method.mockClear) {
      method.mockClear();
    }
  });
};

const addMockUser = userData => {
  const user = { ...userData, _id: userData._id || generateId() };
  mockData.users.push(user);
  return user;
};

const addMockCompany = companyData => {
  const company = { ...companyData, _id: companyData._id || generateId() };
  mockData.companies.push(company);
  return company;
};

// Configurar mocks para os modelos
const setupMongooseMocks = () => {
  jest.mock('../../src/models/user.model', () => mockUserModel, { virtual: true });
  jest.mock('../../src/models/company.model', () => mockCompanyModel, { virtual: true });
};

module.exports = {
  mockUserModel,
  mockCompanyModel,
  clearMockData,
  addMockUser,
  addMockCompany,
  setupMongooseMocks,
  mockData
};
