/**
 * Script para executar os testes do middleware de autenticau00e7u00e3o
 */

const { spawn } = require('child_process');
const path = require('path');

// Caminho para o backend
const backendPath = path.join(__dirname, '../backend');

console.log('Executando testes do middleware de autenticau00e7u00e3o...');

// Executar os testes com Jest
const jest = spawn('npm', ['test', 'tests/middleware/auth.test.js'], {
  cwd: backendPath,
  stdio: 'inherit',
  shell: true
});

jest.on('close', (code) => {
  if (code === 0) {
    console.log('\n\u2705 Testes do middleware de autenticau00e7u00e3o executados com sucesso!\n');
  } else {
    console.error('\n\u274C Erro ao executar os testes do middleware de autenticau00e7u00e3o.\n');
  }
});
