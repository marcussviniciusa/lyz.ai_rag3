/**
 * Script para testar a rota de login administrativo
 */

const axios = require('axios');

async function testAdminLogin() {
  try {
    console.log('=== TESTE DE LOGIN ADMINISTRATIVO ===\n');
    
    const loginData = {
      email: 'marcus@lyz.ai',
      password: 'admin123'
    };
    
    console.log(`Enviando requisiu00e7u00e3o para http://localhost:5000/admin-login`);
    console.log('Dados:', loginData);
    
    const response = await axios.post('http://localhost:5000/admin-login', loginData);
    
    console.log('\nResposta:');
    console.log(`Status: ${response.status}`);
    console.log('Dados da resposta:', JSON.stringify(response.data, null, 2));
    
    if (response.data.success) {
      console.log('\nu2705 Login realizado com sucesso!');
      console.log(`\nInformau00e7u00f5es do usuu00e1rio:`);
      console.log(`- Nome: ${response.data.user.name}`);
      console.log(`- Email: ${response.data.user.email}`);
      console.log(`- Funu00e7u00e3o: ${response.data.user.role}`);
      
      console.log('\nTokens gerados:');
      console.log(`- Access Token: ${response.data.tokens.access.substring(0, 20)}...`);
      console.log(`- Refresh Token: ${response.data.tokens.refresh.substring(0, 20)}...`);
      
      // Salvar tokens em um arquivo para uso posterior se necessário
      const fs = require('fs');
      fs.writeFileSync('./admin-tokens.json', JSON.stringify({
        accessToken: response.data.tokens.access,
        refreshToken: response.data.tokens.refresh,
        user: response.data.user
      }, null, 2));
      
      console.log('\nTokens salvos em ./admin-tokens.json');
    } else {
      console.log('\nu274c Login falhou!');
    }
    
    console.log('\n=== TESTE CONCLUÍDO ===');
  } catch (error) {
    console.log('\nu274c Erro ao fazer login:');
    
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

testAdminLogin();
