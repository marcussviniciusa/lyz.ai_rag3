// Configuração inicial para os testes

// Configurar variáveis de ambiente para testes
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
process.env.JWT_EXPIRES_IN = '15m';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';
process.env.NODE_ENV = 'test';

// Mock global para mongoose
jest.mock('mongoose', () => {
  const mMongoose = {
    connect: jest.fn().mockResolvedValue(true),
    connection: {
      once: jest.fn(),
      on: jest.fn(),
      readyState: 1
    },
    Schema: jest.fn().mockImplementation(() => ({
      pre: jest.fn().mockReturnThis(),
      methods: {},
      statics: {},
      virtual: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis()
    })),
    model: jest.fn().mockImplementation((name) => {
      return {
        find: jest.fn().mockResolvedValue([]),
        findOne: jest.fn().mockResolvedValue(null),
        findById: jest.fn().mockImplementation(() => ({
          populate: jest.fn().mockResolvedValue(null)
        })),
        create: jest.fn().mockImplementation((data) => ({
          ...data,
          _id: 'mock-id-' + Math.random().toString(36).substring(7)
        })),
        countDocuments: jest.fn().mockResolvedValue(0),
        updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
        findByIdAndUpdate: jest.fn().mockResolvedValue(null),
        deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
        modelName: name
      };
    }),
    Types: {
      ObjectId: jest.fn().mockImplementation((id) => id || 'mock-id-' + Math.random().toString(36).substring(7))
    }
  };
  return mMongoose;
});

// Mock para bcrypt
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockImplementation((data) => Promise.resolve(`hashed_${data}`)),
  compare: jest.fn().mockImplementation((data, hash) => Promise.resolve(hash === `hashed_${data}`))
}));
