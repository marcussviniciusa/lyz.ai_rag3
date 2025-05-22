# Documentau00e7u00e3o dos Testes de Autenticau00e7u00e3o

## Visão Geral

Este documento descreve a implementau00e7u00e3o dos testes automatizados para o sistema de autenticau00e7u00e3o da aplicau00e7u00e3o Lyz Healthcare. Os testes abrangem tanto o frontend quanto o backend, garantindo o funcionamento adequado do fluxo de autenticau00e7u00e3o.

## Testes de Frontend

### Estrutura de Testes

Os testes de frontend utilizam as seguintes tecnologias:

- **Jest**: Framework de testes
- **React Testing Library**: Biblioteca para testar componentes React
- **Mock Service Worker**: Para simular chamadas de API

### Componentes Testados

1. **Login Component (`Login.test.jsx`)**
   - Testa a renderizau00e7u00e3o correta do formulu00e1rio de login
   - Valida o processo de envio do formulu00e1rio
   - Verifica o tratamento de sucesso e erro no login
   - Verifica o estado de carregamento durante o processo de login

2. **Serviu00e7o de Autenticau00e7u00e3o (`auth.service.test.js`)**
   - Testa o login com sucesso e armazenamento de tokens
   - Verifica o tratamento de falhas no login
   - Testa a atualizau00e7u00e3o de tokens (refresh token)
   - Verifica as funu00e7u00f5es de verificau00e7u00e3o de autenticau00e7u00e3o

3. **AuthGuard Component (`AuthGuard.test.jsx`)**
   - Testa o redirecionamento quando o usuu00e1rio nu00e3o estu00e1 autenticado
   - Verifica a exibiu00e7u00e3o de indicador de carregamento
   - Confirma que o conteu00fado protegido u00e9 exibido para usuu00e1rios autenticados

4. **Contexto de Autenticau00e7u00e3o (`AuthContext.test.jsx`)**
   - Testa a inicializau00e7u00e3o do contexto e verificau00e7u00e3o de autenticau00e7u00e3o
   - Verifica o carregamento do usuu00e1rio a partir do localStorage
   - Testa o processo de login e logout
   - Verifica o tratamento de erros no refresh de token

## Testes de Backend

### Estrutura de Testes

Os testes de backend utilizam as seguintes tecnologias:

- **Jest**: Framework de testes
- **Supertest**: Biblioteca para testar APIs HTTP
- **Jest Mocks**: Mocks completos para simular interações com o MongoDB sem necessidade de um servidor de banco de dados

### Componentes Testados

1. **Controlador de Autenticação (`auth.controller.test.js`)**
   - Testa o endpoint de validação de email
   - Verifica o processo de login
   - Testa a atualização de token (refresh token)
   - Verifica o tratamento de tokens inválidos ou expirados

2. **Middleware de Autenticação (`auth.test.js`)**
   - Testa o middleware de autenticação (validate)
   - Verifica o middleware de autorização baseado em perfis (authorize)
   - Testa o tratamento de tokens inválidos, inexistentes ou expirados
   - Verifica a validação de usuários ativos/inativos

3. **Testes de Integração (`auth.flow.test.js`)**
   - Testa o fluxo completo de autenticação end-to-end
   - Cobre todo o ciclo desde validação de email até acesso a rotas protegidas
   - Verifica a inativação de usuários e restrição de acesso
   - Testa o refresh de tokens e reautenticação

## Execuu00e7u00e3o dos Testes

### Frontend

Para executar os testes do frontend:

```bash
cd frontend
npm test
```

Para executar um teste especu00edfico:

```bash
cd frontend
npm test -- -t "nome do teste"
```

### Backend

Para executar os testes do backend:

```bash
cd backend
npm test
```

Ou usando os scripts especu00edficos para cada tipo de teste:

```bash
# Para testar o controlador de autenticau00e7u00e3o
node scripts/test-auth-controller.js

# Para testar o middleware de autenticau00e7u00e3o
node scripts/test-auth-middleware.js

# Para executar os testes de integração do fluxo completo
node scripts/test-auth-integration.js
```

## Boas Pru00e1ticas Implementadas

1. **Isolamento de Testes**: Cada teste u00e9 isolado e nu00e3o depende de outros testes
2. **Mocks Apropriados**: Utilizau00e7u00e3o de mocks para serviu00e7os externos e dependu00eancias
3. **Banco de Dados em Memu00f3ria**: Uso de MongoDB Memory Server para testes isolados
4. **Limpeza Pou00f3s-Teste**: Limpeza adequada apou00f3s cada teste
5. **Cobertura Abrangente**: Testes para casos de sucesso e falha

## Pruu00f3ximos Passos

1. **Expandir Cobertura de Testes**:
   - Implementar testes para o processo de registro
   - Adicionar testes para middleware de autenticau00e7u00e3o

2. **Testes de Integrau00e7u00e3o End-to-End**:
   - Implementar testes que verifiquem o fluxo completo de autenticau00e7u00e3o
   - Testar a comunicau00e7u00e3o entre frontend e backend

3. **Automatizau00e7u00e3o de Testes**:
   - Configurar pipeline de CI/CD para executar os testes automaticamente
