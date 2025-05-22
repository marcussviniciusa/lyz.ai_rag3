/**
 * Mock do serviu00e7o do Curseduca para testes
 */

// Dados de um usuu00e1rio mu00f3ck do Curseduca
const mockCursEducaUser = {
  id: '12345',
  name: 'Usuu00e1rio Teste',
  email: 'usuario.teste@example.com',
  active: true
};

// Mock da funu00e7u00e3o de validau00e7u00e3o de usuu00e1rio
const validateCursEducaUser = jest.fn().mockImplementation(async (email) => {
  if (email === mockCursEducaUser.email) {
    return {
      success: true,
      message: 'Usuu00e1rio encontrado no Curseduca',
      data: mockCursEducaUser
    };
  } else if (email === 'usuario.invalido@example.com') {
    return {
      success: false,
      message: 'Usuu00e1rio nu00e3o encontrado no Curseduca'
    };
  } else if (email === 'erro@example.com') {
    throw new Error('Erro de conexu00e3o com o Curseduca');
  }
  
  return {
    success: false,
    message: 'Usuu00e1rio nu00e3o encontrado no Curseduca'
  };
});

module.exports = {
  validateCursEducaUser,
  mockCursEducaUser
};
