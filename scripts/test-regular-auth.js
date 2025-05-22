/**
 * Script para testar a rota regular de autenticau00e7u00e3o
 */

const axios = require('axios');

async function testRegularAuth() {
  try {
    console.log('=== TESTE DA ROTA REGULAR DE AUTENTICAu00c7u00c3O ===\n');
    
    const loginData = {
      email: 'marcus@lyz.ai',
      password: 'admin123'
    };
    
    console.log(`Enviando requisiu00e7u00e3o para http://localhost:5000/api/auth/login`);
    console.log('Dados:', loginData);
    
    const response = await axios.post('http://localhost:5000/api/auth/login', loginData);
    
    console.log('\nResposta:');
    console.log(`Status: ${response.status}`);
    console.log('Dados da resposta:', JSON.stringify(response.data, null, 2));
    
    if (response.data.success) {
      console.log('\n✅ Login regular realizado com sucesso!');
      console.log(`\nInformau00e7u00f5es do usuu00e1rio:`);
      console.log(`- Nome: ${response.data.user.name}`);
      console.log(`- Email: ${response.data.user.email}`);
      console.log(`- Funu00e7u00e3o: ${response.data.user.role}`);
      
      console.log('\nTokens gerados:');
      console.log(`- Access Token: ${response.data.tokens.access.substring(0, 20)}...`);
      console.log(`- Refresh Token: ${response.data.tokens.refresh.substring(0, 20)}...`);
    } else {
      console.log('\n❌ Login regular falhou!');
    }
    
    console.log('\n=== TESTE CONCLUÍDO ===');
  } catch (error) {
    console.log('\n❌ Erro ao fazer login regular:');
    
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log('Dados do erro:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.log('Sem resposta do servidor:', error.message);
    } else {
      console.log('Erro na requisiu00e7u00e3o:', error.message);
    }
    
    console.log('\n=== TESTE CONCLUÍDO COM ERRO ===');
  }
}

testRegularAuth();
