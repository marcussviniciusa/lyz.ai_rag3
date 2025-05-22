# Sistema de Autenticau00e7u00e3o do Lyz Healthcare

## Visu00e3o Geral

Este documento descreve o sistema de autenticau00e7u00e3o implementado no Lyz Healthcare, incluindo detalhes sobre o processo de login, geração de tokens JWT e segurana da aplicau00e7u00e3o.

## Arquitetura

O sistema de autenticau00e7u00e3o utiliza o modelo JWT (JSON Web Tokens) para gerenciar o acesso dos usuu00e1rios. A implementau00e7u00e3o u00e9 composta por:

1. **Backend (API REST)**:
   - Controlador de autenticau00e7u00e3o (auth.controller.js)
   - Rotas de autenticau00e7u00e3o (auth.routes.js)
   - Middleware de autorizau00e7u00e3o (auth.middleware.js)

2. **Frontend**:
   - Serviu00e7o de autenticau00e7u00e3o (auth.service.js)
   - Contexto de autenticau00e7u00e3o (AuthContext.jsx)
   - Pu00e1ginas de login e registro

## Fluxo de Autenticau00e7u00e3o

1. O usuu00e1rio envia credenciais (email/senha) para a API
2. O servidor valida as credenciais contra o banco de dados
3. Se vu00e1lidas, o servidor gera tokens de acesso e refresh
4. Os tokens su00e3o retornados ao cliente e armazenados no localStorage
5. Requisiu00e7u00f5es subsequentes incluem o token de acesso no header Authorization
6. Quando o token expira, o token de refresh u00e9 usado para obter um novo token de acesso

## Implementau00e7u00e3o da Segurana

### 1. Hashing de Senhas

As senhas su00e3o armazenadas com hash bcrypt para maior segurana:

```javascript
// Hash password before saving
userSchema.pre('save', async function(next) {
  const user = this;
  
  if (!user.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});
```

### 2. Verificau00e7u00e3o de Senhas

A verificau00e7u00e3o u00e9 feita usando o mu00e9todo comparePassword no modelo de usuu00e1rio:

```javascript
// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
```

### 3. Geração de Tokens JWT

O sistema gera dois tipos de tokens:

- **Access Token**: Para autorizar o acesso a recursos protegidos (expira em 1 hora)
- **Refresh Token**: Para renovar o access token (expira em 7 dias)

```javascript
const accessToken = jwt.sign(
  { id: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);

const refreshToken = jwt.sign(
  { id: user._id },
  process.env.JWT_REFRESH_SECRET,
  { expiresIn: '7d' }
);
```

## Variáveis de Ambiente Necessárias

O sistema requer as seguintes variáveis de ambiente:

```bash
# JWT
JWT_SECRET=chave_secreta_para_tokens_de_acesso
JWT_REFRESH_SECRET=chave_secreta_para_tokens_de_refresh
JWT_EXPIRES_IN=24h
```

## Endpoints de Autenticau00e7u00e3o

### Login

```
POST /api/auth/login
```

**Request:**
```json
{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "user": {
    "id": "id_do_usuario",
    "name": "Nome do Usuu00e1rio",
    "email": "usuario@exemplo.com",
    "role": "superadmin",
    "company": {
      "id": "id_da_empresa",
      "name": "Nome da Empresa"
    }
  },
  "tokens": {
    "access": "jwt_access_token",
    "refresh": "jwt_refresh_token"
  }
}
```

### Refresh Token

```
POST /api/auth/refresh-token
```

**Request:**
```json
{
  "refreshToken": "jwt_refresh_token"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "accessToken": "novo_jwt_access_token"
}
```

## Mecanismos de Proteção

1. **Tokens de Curta Duração**: Access tokens expiram em 1 hora, limitando a janela de vulnerabilidade
2. **Assinaturas Distintas**: Tokens de acesso e refresh usam segredos diferentes
3. **Verificação de Papel**: Os tokens incluem informações sobre o papel do usuário para controle de acesso
4. **Renovação Segura**: O refresh token só pode ser usado para gerar novos access tokens, não para acessar recursos

## Melhores Práticas Implementadas

1. Senhas nunca são armazenadas em texto puro
2. Configurações sensíveis são mantidas em variáveis de ambiente
3. Tokens incluem apenas informações essenciais (não contêm dados sensíveis)
4. O sistema implementa um mecanismo de logout que invalida tokens
5. Diferentes segredos para tokens de acesso e refresh
