// Arquivo de configurau00e7u00e3o para testes Jest

// Adiciona as asseror custom do jest-dom
import '@testing-library/jest-dom';

// Mock para localStorage durante os testes
class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = String(value);
  }

  removeItem(key) {
    delete this.store[key];
  }
}

// Implementa mock do localStorage globalmente
global.localStorage = new LocalStorageMock();

// Mock para fetch API
global.fetch = jest.fn();

// Reset dos mocks apu00f3s cada teste
afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});
