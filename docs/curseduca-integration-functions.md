# Documentau00e7u00e3o das Funu00e7u00f5es de Integrau00e7u00e3o com Curseduca

Este documento descreve as funu00e7u00f5es desenvolvidas para a integrau00e7u00e3o entre o sistema Lyz e a plataforma Curseduca.

## 1. Validau00e7u00e3o de Usuu00e1rio no Curseduca

### `validateCursEducaUser(email)`

**Descrição**: Realiza uma consulta na API do Curseduca para validar se um email está cadastrado na plataforma.

**Parâmetros**:
- `email` (String): Email do usuário a ser validado.

**Retorno**:
- Objeto com `success` (Boolean) e `data` (Object) ou `message` (String).

**Localização**: `/backend/src/services/curseduca.service.js`

**Exemplo de uso**:
```javascript
const result = await validateCursEducaUser('usuario@exemplo.com');

if (result.success) {
  // Usuário encontrado no Curseduca
  const userData = result.data;
} else {
  // Usuário não encontrado ou erro na validação
  console.error(result.message);
}
```

## 2. Criação de Usuário a partir de Dados do Curseduca

### `createUserFromCurseduca(cursEducaData, password)`

**Descrição**: Cria um usuário no sistema Lyz a partir dos dados obtidos da plataforma Curseduca. Também cria uma empresa associada ao usuário.

**Parâmetros**:
- `cursEducaData` (Object): Dados do usuário obtidos da API do Curseduca.
- `password` (String): Senha escolhida pelo usuário.

**Retorno**:
- Objeto com `success` (Boolean) e `user` (Object), `company` (Object) ou `message` (String).

**Localização**: `/backend/src/controllers/auth.controller.js`

**Exemplo de uso**:
```javascript
const cursEducaData = {
  id: '12345',
  name: 'Nome do Usuário',
  email: 'usuario@exemplo.com'
};

const result = await createUserFromCurseduca(cursEducaData, 'senha123');

if (result.success) {
  // Usuário criado com sucesso
  const { user, company } = result;
} else {
  // Erro na criação do usuário
  console.error(result.message);
}
```

## 3. Criação de Empresa para Usuário

### `createCompanyForUser(userName)`

**Descrição**: Cria uma empresa para um novo usuário do sistema. Cada usuário é vinculado a uma empresa específica.

**Parâmetros**:
- `userName` (String): Nome do usuário para criar a empresa associada.

**Retorno**:
- Objeto com `success` (Boolean) e `company` (Object) ou `message` (String).

**Localização**: `/backend/src/controllers/auth.controller.js`

**Exemplo de uso**:
```javascript
const result = await createCompanyForUser('Nome do Usuário');

if (result.success) {
  // Empresa criada com sucesso
  const company = result.company;
} else {
  // Erro na criação da empresa
  console.error(result.message);
}
```

## 4. Endpoint de Validação de Email

### `validateEmail(req, res)`

**Descrição**: Controller que recebe um email, verifica se já existe no sistema e, caso não exista, valida com a API do Curseduca.

**Parâmetros**:
- `req.body.email` (String): Email a ser validado.

**Retorno**:
- Resposta HTTP com status e dados do usuário ou mensagem de erro.

**Localização**: `/backend/src/controllers/auth.controller.js`

**Endpoint**: `POST /api/auth/validate-email`

## 5. Endpoint de Registro

### `register(req, res)`

**Descrição**: Controller que registra um novo usuário no sistema após validar novamente com o Curseduca.

**Parâmetros**:
- `req.body.curseduca_id` (String): ID do usuário no Curseduca.
- `req.body.name` (String): Nome do usuário.
- `req.body.email` (String): Email do usuário.
- `req.body.password` (String): Senha escolhida pelo usuário.

**Retorno**:
- Resposta HTTP com status, dados do usuário e tokens de acesso ou mensagem de erro.

**Localização**: `/backend/src/controllers/auth.controller.js`

**Endpoint**: `POST /api/auth/register`

## Fluxo Completo de Integração

O fluxo completo de integração entre o Lyz e o Curseduca envolve:

1. O usuário fornece seu email no frontend
2. O frontend chama o endpoint de validação de email
3. O backend valida o email com a API do Curseduca
4. Se válido, o frontend exibe o formulário de cadastro com os dados pré-preenchidos
5. O usuário define sua senha e completa o cadastro
6. O backend valida novamente com o Curseduca, cria a empresa e o usuário
7. O usuário recebe tokens de acesso e é redirecionado para o dashboard
