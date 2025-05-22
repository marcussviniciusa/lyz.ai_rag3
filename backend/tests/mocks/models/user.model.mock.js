/**
 * Mock para o modelo User
 */

// Banco de dados em memu00f3ria para testes
const userDb = [];

// Geradores de ID
const generateId = () => `user-${Math.random().toString(36).substr(2, 9)}`;

// Mock do modelo User
const UserModel = {
  findOne: jest.fn().mockImplementation((query) => {
    const user = userDb.find(u => {
      if (query.email) return u.email === query.email;
      if (query._id) return u._id === query._id;
      return false;
    });
    return Promise.resolve(user);
  }),
  
  findById: jest.fn().mockImplementation((id) => ({
    populate: jest.fn().mockImplementation(() => {
      const user = userDb.find(u => u._id === id);
      return Promise.resolve(user);
    })
  })),
  
  create: jest.fn().mockImplementation((data) => {
    const newUser = { ...data, _id: data._id || generateId() };
    userDb.push(newUser);
    return Promise.resolve(newUser);
  }),
  
  findByIdAndUpdate: jest.fn().mockImplementation((id, update) => {
    const index = userDb.findIndex(u => u._id === id);
    if (index !== -1) {
      userDb[index] = { ...userDb[index], ...update };
      return Promise.resolve(userDb[index]);
    }
    return Promise.resolve(null);
  })
};

// Funu00e7u00f5es auxiliares para testes
const clearUserDb = () => {
  userDb.length = 0;
  Object.values(UserModel).forEach(fn => {
    if (typeof fn === 'function' && fn.mockClear) {
      fn.mockClear();
    }
  });
};

const addTestUser = (userData) => {
  const user = { ...userData, _id: userData._id || generateId() };
  userDb.push(user);
  return user;
};

module.exports = UserModel;
module.exports.testUtils = {
  clearUserDb,
  addTestUser,
  userDb
};
