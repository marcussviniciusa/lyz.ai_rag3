/**
 * Mocks manuais para uso nos testes sem depender de MongoDB Memory Server
 */

// Dados de teste iniciais
const testData = {
  users: [],
  companies: []
};

// Geradores de ID
const generateId = () => `mock-id-${Math.random().toString(36).substr(2, 9)}`;

// Mock do User Model
const UserModel = {
  findOne: jest.fn().mockImplementation((query) => {
    const user = testData.users.find(u => {
      if (query.email) return u.email === query.email;
      if (query._id) return u._id === query._id;
      return false;
    });
    return Promise.resolve(user);
  }),
  findById: jest.fn().mockImplementation((id) => {
    return {
      populate: jest.fn().mockImplementation(() => {
        const user = testData.users.find(u => u._id === id);
        if (user && user.company_id) {
          const company = testData.companies.find(c => c._id === user.company_id);
          if (company) {
            user.company_id = { ...company };
          }
        }
        return Promise.resolve(user);
      })
    };
  }),
  create: jest.fn().mockImplementation((data) => {
    const newUser = { ...data, _id: data._id || generateId() };
    testData.users.push(newUser);
    return Promise.resolve(newUser);
  }),
};

// Mock do Company Model
const CompanyModel = {
  findOne: jest.fn().mockImplementation((query) => {
    const company = testData.companies.find(c => {
      if (query.name) return c.name === query.name;
      if (query._id) return c._id === query._id;
      return false;
    });
    return Promise.resolve(company);
  }),
  create: jest.fn().mockImplementation((data) => {
    const newCompany = { ...data, _id: data._id || generateId() };
    testData.companies.push(newCompany);
    return Promise.resolve(newCompany);
  })
};

// Funções para ajudar nos testes
const clearTestData = () => {
  testData.users = [];
  testData.companies = [];
  jest.clearAllMocks();
};

const addTestUser = (userData) => {
  const user = { ...userData, _id: userData._id || generateId() };
  testData.users.push(user);
  return user;
};

const addTestCompany = (companyData) => {
  const company = { ...companyData, _id: companyData._id || generateId() };
  testData.companies.push(company);
  return company;
};

module.exports = {
  UserModel,
  CompanyModel,
  clearTestData,
  addTestUser,
  addTestCompany,
  testData
};
