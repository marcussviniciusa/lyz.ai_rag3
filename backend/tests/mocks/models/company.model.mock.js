/**
 * Mock para o modelo Company
 */

// Banco de dados em memu00f3ria para testes
const companyDb = [];

// Geradores de ID
const generateId = () => `company-${Math.random().toString(36).substr(2, 9)}`;

// Mock do modelo Company
const CompanyModel = {
  findOne: jest.fn().mockImplementation((query) => {
    const company = companyDb.find(c => {
      if (query.name) return c.name === query.name;
      if (query._id) return c._id === query._id;
      return false;
    });
    return Promise.resolve(company);
  }),
  
  findById: jest.fn().mockImplementation((id) => {
    const company = companyDb.find(c => c._id === id);
    return Promise.resolve(company);
  }),
  
  create: jest.fn().mockImplementation((data) => {
    const newCompany = { ...data, _id: data._id || generateId() };
    companyDb.push(newCompany);
    return Promise.resolve(newCompany);
  })
};

// Funu00e7u00f5es auxiliares para testes
const clearCompanyDb = () => {
  companyDb.length = 0;
  Object.values(CompanyModel).forEach(fn => {
    if (typeof fn === 'function' && fn.mockClear) {
      fn.mockClear();
    }
  });
};

const addTestCompany = (companyData) => {
  const company = { ...companyData, _id: companyData._id || generateId() };
  companyDb.push(company);
  return company;
};

module.exports = CompanyModel;
module.exports.testUtils = {
  clearCompanyDb,
  addTestCompany,
  companyDb
};
