/**
 * Utilitário para mock de banco de dados para testes
 * Em vez de usar mongodb-memory-server, usamos jest mocks
 */

const mongoose = require('mongoose');

// Mock de dados para os modelos
const mockData = {
  users: [],
  companies: []
};

// Configurando mocks para os modelos Mongoose
const setupMocks = () => {
  // Mock do método findOne
  jest.spyOn(mongoose.Model, 'findOne').mockImplementation(function(criteria) {
    const modelName = this.modelName.toLowerCase();
    const collection = mockData[modelName + 's'] || [];
    
    const item = collection.find(item => {
      return Object.keys(criteria).every(key => {
        return item[key] === criteria[key];
      });
    });
    
    return Promise.resolve(item || null);
  });

  // Mock do método findById
  jest.spyOn(mongoose.Model, 'findById').mockImplementation(function(id) {
    const modelName = this.modelName.toLowerCase();
    const collection = mockData[modelName + 's'] || [];
    const item = collection.find(item => item._id.toString() === id.toString());
    
    // Adicionando método populate
    const result = {
      populate: jest.fn().mockImplementation(() => {
        return Promise.resolve(item || null);
      })
    };
    
    return result;
  });
  
  // Mock do método create
  jest.spyOn(mongoose.Model, 'create').mockImplementation(function(data) {
    const modelName = this.modelName.toLowerCase();
    const collection = mockData[modelName + 's'] || [];
    
    const newItem = {
      ...data,
      _id: data._id || mongoose.Types.ObjectId().toString()
    };
    
    collection.push(newItem);
    mockData[modelName + 's'] = collection;
    
    return Promise.resolve(newItem);
  });
};

/**
 * Inicializa os mocks para testes
 */
module.exports.connect = async () => {
  setupMocks();
  return Promise.resolve();
};

/**
 * Limpa os mocks após os testes
 */
module.exports.closeDatabase = async () => {
  jest.restoreAllMocks();
  return Promise.resolve();
};

/**
 * Limpa os dados mockados
 */
module.exports.clearDatabase = async () => {
  Object.keys(mockData).forEach(key => {
    mockData[key] = [];
  });
  return Promise.resolve();
};

/**
 * Adiciona dados de teste
 */
module.exports.addTestData = (collection, data) => {
  if (!mockData[collection]) {
    mockData[collection] = [];
  }
  
  const newItem = {
    ...data,
    _id: data._id || mongoose.Types.ObjectId().toString()
  };
  
  mockData[collection].push(newItem);
  return newItem;
};

module.exports.mockData = mockData;
