/**
 * Script para testar a API de autenticau00e7u00e3o
 */

const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testAuthAPI() {
  try {
    console.log('=== TESTE DA API DE AUTENTICAu00c7u00c3O ===\n');
    
    // Testar rota de sau00fade
    console.log('1. Testando rota de sau00fade...');
    try {
      const healthResponse = await axios.get('http://localhost:5000/health');
      console.log('   ✅ Rota de sau00fade OK:', healthResponse.data);
    } catch (error) {
      console.log('   ❌ Erro na rota de sau00fade:', error.message);
    }
    
    // Testar rota de login
    console.log('\n2. Testando rota de login...');
    try {
      const loginData = {
        email: 'marcus@lyz.ai',
        password: 'admin123'
      };
      
      console.log(`   Enviando requisiu00e7u00e3o para ${API_URL}/auth/login com:`, loginData);
      const loginResponse = await axios.post(`${API_URL}/auth/login`, loginData);
      console.log('   ✅ Login OK:', loginResponse.data);
    } catch (error) {
      console.log('   ❌ Erro no login:');
      if (error.response) {
        // A requisiu00e7u00e3o foi feita e o servidor respondeu com um status diferente de 2xx
        console.log(`   - Status: ${error.response.status}`);
        console.log(`   - Mensagem: ${JSON.stringify(error.response.data || 'Sem dados')}`);
        console.log(`   - Headers:`, error.response.headers);
      } else if (error.request) {
        // A requisiu00e7u00e3o foi feita mas nu00e3o houve resposta
        console.log('   - Sem resposta do servidor');
      } else {
        // Erro na configurau00e7u00e3o da requisiu00e7u00e3o
        console.log(`   - Erro: ${error.message}`);
      }
    }
    
    // Testar todas as rotas disponíveis
    console.log('\n3. Verificando rotas configuradas no servidor...');
    try {
      // Listar todas as rotas usando uma opção OPTIONS
      const optionsResponse = await axios.options(`${API_URL}/auth`);
      console.log('   ✅ Rotas disponíveis:', optionsResponse.data);
    } catch (error) {
      console.log('   ❌ Não foi possível listar as rotas:', error.message);
      
      // Tentar detectar rotas manualmente
      console.log('   Tentando detectar rotas conhecidas:');
      const routes = [
        '/api/auth/validate-email',
        '/api/auth/register',
        '/api/auth/login',
        '/api/auth/refresh-token',
        '/api/users',
        '/api/companies',
        '/api/plans'
      ];
      
      for (const route of routes) {
        try {
          await axios.options(`http://localhost:5000${route}`);
          console.log(`   - ${route}: Disponível`);
        } catch (error) {
          console.log(`   - ${route}: ${error.response ? `Status ${error.response.status}` : 'Indisponível'}`);
        }
      }
    }
    
    console.log('\n=== TESTE CONCLUÍDO ===');
  } catch (error) {
    console.error('Erro geral no teste:', error);
  }
}

testAuthAPI();
