module.exports = {
  // Diretório onde o Jest deve procurar pelos arquivos de teste
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  
  // Ignora node_modules
  testPathIgnorePatterns: ['/node_modules/'],
  
  // Configura o Jest para usar babel-jest para processar os arquivos .js
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  
  // Configurações do Jest para antes de cada teste
  setupFiles: ['<rootDir>/tests/setup-env.js'],
  
  // Mock automático para módulos específicos
  moduleNameMapper: {
    '^mongoose$': '<rootDir>/tests/mocks/mongoose.mock.js',
    '^../models/(.*)$': '<rootDir>/tests/mocks/models/$1.mock.js'
  },
  
  // Opções de cobertura de teste
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/mocks/'
  ],
  
  // Configuração de timeout (em milissegundos)
  testTimeout: 10000,
  
  // Configuração de verbosidade
  verbose: true
};
