module.exports = {
  // A lista de caminho que o Jest deve procurar pelos testes
  roots: ['<rootDir>/src'],

  // Extensu00f5es de arquivo que conteu00eam testes
  testMatch: [
    '**/__tests__/**/*.js?(x)',
    '**/?(*.)+(spec|test).js?(x)'
  ],

  // Transformau00e7u00f5es que cada arquivo deve passar
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },

  // Configurau00e7u00e3o para transformar mu00f3dulos ESM para CommonJS
  transformIgnorePatterns: [
    '/node_modules/(?!(axios|react-router-dom|@babel|@remix-run|@testing-library)/).+'
  ],

  // Mu00f3dulos que seru00e3o usado como alternativas aos mu00f3dulos reais
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/src/__mocks__/fileMock.js'
  },

  // Configurau00e7u00f5es do ambiente de teste
  testEnvironment: 'jsdom',

  // Configura cobertura de cu00f3digo
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.d.ts',
    '!src/index.js',
    '!src/reportWebVitals.js',
    '!src/setupTests.js'
  ],
  coverageThreshold: {
    global: {
      statements: 60,
      branches: 60,
      functions: 60,
      lines: 60,
    },
  },

  // Configurau00e7u00f5es adicionais
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
};
