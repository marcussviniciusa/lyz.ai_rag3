/**
 * Mocks para testes de autenticau00e7u00e3o
 */

// Mock de usuu00e1rio ativo
const mockActiveUser = {
  _id: 'active-user-id',
  name: 'Active User',
  email: 'active@example.com',
  role: 'admin',
  active: true,
  company_id: { _id: 'company-123', name: 'Test Company' }
};

// Mock de usuu00e1rio inativo
const mockInactiveUser = {
  _id: 'inactive-user-id',
  name: 'Inactive User',
  email: 'inactive@example.com',
  role: 'user',
  active: false,
  company_id: { _id: 'company-123', name: 'Test Company' }
};

// Funu00e7u00e3o para configurar os mocks para o teste
const setupMocks = ({ req, res, next, jwt, User, userToReturn = null }) => {
  // Limpar mocks anteriores
  jest.clearAllMocks();
  
  // Configurar objetos bau00e1sicos
  req = req || { headers: {} };
  res = res || {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };
  next = next || jest.fn();
  
  // Se jwt foi passado, configurar o mock
  if (jwt) {
    jest.spyOn(jwt, 'verify').mockImplementation((token, secret) => {
      if (token === 'invalid-token') {
        throw new Error('Invalid token');
      }
      return { id: userToReturn ? userToReturn._id : 'default-user-id' };
    });
  }
  
  // Se User foi passado, configurar o mock
  if (User) {
    const mockPopulate = jest.fn().mockResolvedValue(userToReturn);
    const mockFindById = jest.fn().mockReturnValue({ populate: mockPopulate });
    jest.spyOn(User, 'findById').mockImplementation(mockFindById);
  }
  
  return { req, res, next };
};

module.exports = {
  mockActiveUser,
  mockInactiveUser,
  setupMocks
};
