/**
 * Testes de integrau00e7u00e3o para o fluxo completo de autenticau00e7u00e3o
 */

const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

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

describe('Auth Flow Integration Tests', () => {
  let app;
  let User;
  let Company;
  let authToken;
  let userId;
  
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
    
    // Importar os modelos apu00f3s a conexu00e3o com o banco de dados
    User = require('../../src/models/user.model');
    Company = require('../../src/models/company.model');
    
    // Inicializar o aplicativo Express
    app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    
    // Configurar as rotas de autenticau00e7u00e3o
    const authRoutes = require('../../src/routes/auth.routes');
    app.use('/api/auth', authRoutes);
    
    // Criar uma rota protegida para testar autenticau00e7u00e3o
    const { authenticate, authorize } = require('../../src/middleware/auth');
    
    // Rota que requer autenticau00e7u00e3o
    app.get('/api/protected', authenticate, (req, res) => {
      return res.status(200).json({
        success: true,
        message: 'Acesso autorizado',
        user: {
          id: req.user._id,
          name: req.user.name,
          role: req.user.role
        }
      });
    });
    
    // Rota que requer permissu00e3o de admin
    app.get('/api/admin', authenticate, authorize('admin'), (req, res) => {
      return res.status(200).json({
        success: true,
        message: 'Acesso de administrador autorizado'
      });
    });
  });
  
  /**
   * Limpar o banco de dados antes de cada teste
   */
  beforeEach(async () => {
    await dbHandler.clearDatabase();
  });
  
  /**
   * Encerrar a conexu00e3o apu00f3s todos os testes
   */
  afterAll(async () => {
    await dbHandler.closeDatabase();
  });
  
  /**
   * Teste do fluxo completo de autenticau00e7u00e3o
   */
  it('deve completar todo o fluxo de autenticau00e7u00e3o com sucesso', async () => {
    // 1. Validau00e7u00e3o de email
    const validateResponse = await request(app)
      .post('/api/auth/validate-email')
      .send({ email: 'usuario.teste@example.com' });
    
    expect(validateResponse.status).toBe(200);
    expect(validateResponse.body.success).toBe(true);
    expect(validateResponse.body.userData).toBeDefined();
    
    const cursEducaData = validateResponse.body.userData;
    
    // 2. Registro de usuu00e1rio
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        curseduca_id: cursEducaData.id,
        name: cursEducaData.name,
        email: cursEducaData.email,
        password: 'Senha@123'
      });
    
    expect(registerResponse.status).toBe(201);
    expect(registerResponse.body.success).toBe(true);
    expect(registerResponse.body.tokens).toBeDefined();
    expect(registerResponse.body.tokens.access).toBeDefined();
    expect(registerResponse.body.tokens.refresh).toBeDefined();
    
    // Salvar tokens e ID do usuu00e1rio para uso nos pru00f3ximos testes
    authToken = registerResponse.body.tokens.access;
    refreshToken = registerResponse.body.tokens.refresh;
    userId = registerResponse.body.user.id;
    
    // 3. Acessar rota protegida com token
    const protectedResponse = await request(app)
      .get('/api/protected')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(protectedResponse.status).toBe(200);
    expect(protectedResponse.body.success).toBe(true);
    expect(protectedResponse.body.message).toContain('Acesso autorizado');
    expect(protectedResponse.body.user.id).toBe(userId);
    
    // 4. Tentar acessar rota de admin como usuu00e1rio comum (deve falhar)
    const adminResponse = await request(app)
      .get('/api/admin')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(adminResponse.status).toBe(403);
    expect(adminResponse.body.success).toBe(false);
    expect(adminResponse.body.message).toContain('Acesso proibido');
    
    // 5. Atualizar token com refresh token
    const refreshResponse = await request(app)
      .post('/api/auth/refresh-token')
      .send({ refreshToken });
    
    expect(refreshResponse.status).toBe(200);
    expect(refreshResponse.body.success).toBe(true);
    expect(refreshResponse.body.accessToken).toBeDefined();
    
    // Salvar o novo access token
    const newAccessToken = refreshResponse.body.accessToken;
    
    // 6. Acessar rota protegida com o novo token
    const newProtectedResponse = await request(app)
      .get('/api/protected')
      .set('Authorization', `Bearer ${newAccessToken}`);
    
    expect(newProtectedResponse.status).toBe(200);
    expect(newProtectedResponse.body.success).toBe(true);
    
    // 7. Login com as credenciais
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'usuario.teste@example.com',
        password: 'Senha@123'
      });
    
    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.success).toBe(true);
    expect(loginResponse.body.tokens).toBeDefined();
    expect(loginResponse.body.user).toBeDefined();
  });
  
  /**
   * Teste de erro no acesso a rota protegida sem token
   */
  it('deve negar acesso a rotas protegidas sem token de autenticau00e7u00e3o', async () => {
    const response = await request(app).get('/api/protected');
    
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('Token nu00e3o fornecido');
  });
  
  /**
   * Teste de erro no acesso com token invu00e1lido
   */
  it('deve negar acesso a rotas protegidas com token invu00e1lido', async () => {
    const response = await request(app)
      .get('/api/protected')
      .set('Authorization', 'Bearer invalid-token');
    
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
  
  /**
   * Teste de inativau00e7u00e3o de usuu00e1rio
   */
  it('deve negar acesso quando o usuu00e1rio for desativado', async () => {
    // 1. Registrar um usuu00e1rio
    const validateResponse = await request(app)
      .post('/api/auth/validate-email')
      .send({ email: 'usuario.teste@example.com' });
    
    const cursEducaData = validateResponse.body.userData;
    
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        curseduca_id: cursEducaData.id,
        name: cursEducaData.name,
        email: cursEducaData.email,
        password: 'Senha@123'
      });
    
    const userId = registerResponse.body.user.id;
    const authToken = registerResponse.body.tokens.access;
    
    // 2. Verificar acesso inicial
    const initialResponse = await request(app)
      .get('/api/protected')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(initialResponse.status).toBe(200);
    
    // 3. Desativar o usuu00e1rio
    await User.findByIdAndUpdate(userId, { active: false });
    
    // 4. Tentar acessar apou00f3s desativau00e7u00e3o
    const afterResponse = await request(app)
      .get('/api/protected')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(afterResponse.status).toBe(403);
    expect(afterResponse.body.success).toBe(false);
    expect(afterResponse.body.message).toContain('Usuu00e1rio inativo');
  });
});
