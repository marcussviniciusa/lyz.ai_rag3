/**
 * Testes para o controlador de autenticau00e7u00e3o
 */

const mongoose = require('mongoose');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Importar o handler do banco de dados
const dbHandler = require('../utils/db-handler');

// Mock do serviu00e7o do Curseduca
jest.mock('../../src/services/curseduca.service', () => {
  return require('../mocks/curseduca.service.mock');
});

// Mock do mu00f3dulo de logger
jest.mock('../../src/utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn()
}));

// Mock do JWT
jest.mock('jsonwebtoken');

// App express
let app;
// Modelos
let User;
let Company;

/**
 * Configurau00e7u00e3o antes de todos os testes
 */
beforeAll(async () => {
  // Conectar ao banco de dados de teste
  await dbHandler.connect();
  
  // Configurar as variu00e1veis de ambiente necessarias para JWT
  process.env.JWT_SECRET = 'test-jwt-secret';
  process.env.JWT_REFRESH_SECRET = 'test-jwt-refresh-secret';
  process.env.JWT_EXPIRES_IN = '1h';
  
  // Importar os modelos apou00f3s a conexu00e3o com o banco de dados
  User = require('../../src/models/user.model');
  Company = require('../../src/models/company.model');
  
  // Importar e inicializar o aplicativo Express
  const express = require('express');
  const bodyParser = require('body-parser');
  
  app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  
  // Configurar as rotas de autenticau00e7u00e3o
  const authRoutes = require('../../src/routes/auth.routes');
  app.use('/api/auth', authRoutes);
});

/**
 * Limpar o banco de dados antes de cada teste
 */
beforeEach(async () => {
  await dbHandler.clearDatabase();
  
  // Resetar os mocks de JWT
  jwt.sign.mockReset();
  jwt.verify.mockReset();
});

/**
 * Encerrar a conexu00e3o apou00f3s todos os testes
 */
afterAll(async () => {
  await dbHandler.closeDatabase();
});

/**
 * Testes para o endpoint de validau00e7u00e3o de email
 */
describe('POST /api/auth/validate-email', () => {
  it('deve retornar erro 400 para requisiu00e7u00e3o sem email', async () => {
    const response = await request(app)
      .post('/api/auth/validate-email')
      .send({});
    
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('Email u00e9 obrigatu00f3rio');
  });
  
  it('deve retornar erro 400 para email ju00e1 cadastrado no sistema', async () => {
    // Criar um usuu00e1rio pru00e9vio com o mesmo email
    await User.create({
      name: 'Usuu00e1rio Existente',
      email: 'usuario.teste@example.com',
      password: await bcrypt.hash('senha123', 10),
      role: 'user',
      active: true,
      company_id: new mongoose.Types.ObjectId()
    });
    
    const response = await request(app)
      .post('/api/auth/validate-email')
      .send({ email: 'usuario.teste@example.com' });
    
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('Email ju00e1 cadastrado');
  });
  
  it('deve retornar erro 404 para email nu00e3o encontrado no Curseduca', async () => {
    const response = await request(app)
      .post('/api/auth/validate-email')
      .send({ email: 'usuario.invalido@example.com' });
    
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('nu00e3o encontrado no Curseduca');
  });
  
  it('deve validar email com sucesso para um usuu00e1rio vu00e1lido do Curseduca', async () => {
    const response = await request(app)
      .post('/api/auth/validate-email')
      .send({ email: 'usuario.teste@example.com' });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toContain('Email validado com sucesso');
    expect(response.body.userData).toBeDefined();
    expect(response.body.userData.id).toBe('12345');
    expect(response.body.userData.name).toBe('Usuu00e1rio Teste');
  });
});

/**
 * Testes para o endpoint de login
 */
describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    // Configurar o mock do JWT para retornar tokens fixos
    jwt.sign.mockImplementation((payload, secret, options) => {
      if (secret === process.env.JWT_SECRET) {
        return 'mock-access-token';
      } else if (secret === process.env.JWT_REFRESH_SECRET) {
        return 'mock-refresh-token';
      }
      return 'mock-token';
    });
    
    // Criar uma empresa para o usuu00e1rio
    const company = await Company.create({
      name: 'Empresa Teste',
      active: true,
      token_limit: 100000,
      tokens_used: 0
    });
    
    // Criar um usuu00e1rio de teste
    await User.create({
      name: 'Usuu00e1rio Teste',
      email: 'usuario.teste@example.com',
      password: await bcrypt.hash('senha123', 10),
      role: 'user',
      active: true,
      company_id: company._id
    });
  });
  
  it('deve retornar erro para login com email inexistente', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'naoexiste@example.com',
        password: 'senha123'
      });
    
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('Usuu00e1rio nu00e3o encontrado');
  });
  
  it('deve retornar erro para login com senha incorreta', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'usuario.teste@example.com',
        password: 'senha-incorreta'
      });
    
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('Credenciais invu00e1lidas');
  });
  
  it('deve realizar login com sucesso para credenciais vu00e1lidas', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'usuario.teste@example.com',
        password: 'senha123'
      });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toContain('Login realizado com sucesso');
    expect(response.body.user).toBeDefined();
    expect(response.body.tokens).toBeDefined();
    expect(response.body.tokens.access).toBe('mock-access-token');
    expect(response.body.tokens.refresh).toBe('mock-refresh-token');
    
    // Verificar se JWT foi chamado com os paru00e2metros corretos
    expect(jwt.sign).toHaveBeenCalledTimes(2);
  });
  
  it('deve retornar erro para usuu00e1rio inativo', async () => {
    // Atualizar o usuu00e1rio para inativo
    await User.updateOne(
      { email: 'usuario.teste@example.com' },
      { active: false }
    );
    
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'usuario.teste@example.com',
        password: 'senha123'
      });
    
    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('Usuu00e1rio inativo');
  });
});

/**
 * Testes para o endpoint de refresh token
 */
describe('POST /api/auth/refresh-token', () => {
  beforeEach(async () => {
    // Configurar o mock do JWT para sign
    jwt.sign.mockImplementation(() => 'novo-access-token');
    
    // Criar uma empresa para o usuu00e1rio
    const company = await Company.create({
      name: 'Empresa Teste',
      active: true,
      token_limit: 100000,
      tokens_used: 0
    });
    
    // Criar um usuu00e1rio de teste
    await User.create({
      _id: new mongoose.Types.ObjectId('60d21b4667d0d8992e610c85'),
      name: 'Usuu00e1rio Teste',
      email: 'usuario.teste@example.com',
      password: await bcrypt.hash('senha123', 10),
      role: 'user',
      active: true,
      company_id: company._id
    });
  });
  
  it('deve retornar erro 400 para requisiu00e7u00e3o sem refresh token', async () => {
    const response = await request(app)
      .post('/api/auth/refresh-token')
      .send({});
    
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('Refresh token nu00e3o fornecido');
  });
  
  it('deve retornar erro para token invu00e1lido', async () => {
    // Mock do JWT para verificau00e7u00e3o
    jwt.verify.mockImplementation(() => {
      throw new jwt.JsonWebTokenError('Token invu00e1lido');
    });
    
    const response = await request(app)
      .post('/api/auth/refresh-token')
      .send({ refreshToken: 'token-invalido' });
    
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('Token invu00e1lido');
  });
  
  it('deve retornar erro para token expirado', async () => {
    // Mock do JWT para verificau00e7u00e3o
    jwt.verify.mockImplementation(() => {
      throw new jwt.TokenExpiredError('Token expirado');
    });
    
    const response = await request(app)
      .post('/api/auth/refresh-token')
      .send({ refreshToken: 'token-expirado' });
    
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('Token invu00e1lido ou expirado');
  });
  
  it('deve retornar um novo access token para refresh token vu00e1lido', async () => {
    // Mock do JWT para verificau00e7u00e3o
    jwt.verify.mockImplementation(() => ({
      id: '60d21b4667d0d8992e610c85'
    }));
    
    const response = await request(app)
      .post('/api/auth/refresh-token')
      .send({ refreshToken: 'refresh-token-valido' });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.accessToken).toBe('novo-access-token');
    
    // Verificar se JWT foi chamado com os paru00e2metros corretos
    expect(jwt.verify).toHaveBeenCalledWith(
      'refresh-token-valido',
      process.env.JWT_REFRESH_SECRET
    );
    expect(jwt.sign).toHaveBeenCalled();
  });
  
  it('deve retornar erro para usuu00e1rio nu00e3o encontrado', async () => {
    // Mock do JWT para verificau00e7u00e3o com ID inexistente
    jwt.verify.mockImplementation(() => ({
      id: '60d21b4667d0d8992e610c86' // ID diferente
    }));
    
    const response = await request(app)
      .post('/api/auth/refresh-token')
      .send({ refreshToken: 'refresh-token-valido' });
    
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('Usuu00e1rio nu00e3o encontrado');
  });
});
