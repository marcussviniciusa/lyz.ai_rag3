#!/bin/bash

# Script para executar os testes de autenticau00e7u00e3o sem depender do MongoDB Memory Server
echo "Executando testes de autenticau00e7u00e3o do backend..."

# Configurar ambiente de teste
export NODE_ENV=test
export JWT_SECRET=test-jwt-secret
export JWT_REFRESH_SECRET=test-refresh-secret
export JWT_EXPIRES_IN=15m

# Executar testes personalizados com Jest
node_modules/.bin/jest tests/run-auth-tests.js --verbose
