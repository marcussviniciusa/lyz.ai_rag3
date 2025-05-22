# Sistema de Autenticau00e7u00e3o - Lyz Healthcare

## Visu00e3o Geral

O sistema de autenticau00e7u00e3o do Lyz Healthcare oferece um mecanismo completo para controle de acesso, validau00e7u00e3o de usuau00e1rios e proteu00e7u00e3o de rotas. Esta documentau00e7u00e3o detalha os principais componentes e funcionamento do sistema.

## Arquitetura

O sistema de autenticau00e7u00e3o foi desenvolvido com uma arquitetura de camadas que separa claramente as responsabilidades:

1. **Frontend**:
   - Gerenciamento de estado de autenticau00e7u00e3o via `AuthContext`
   - Proteu00e7u00e3o de rotas com `AuthGuard`
   - Componente de login para entrada no sistema
   - Serviu00e7o de autenticau00e7u00e3o para comunicau00e7u00e3o com a API

2. **Backend**:
   - Middleware de autenticau00e7u00e3o para validar tokens
   - Middleware de autorizau00e7u00e3o para controle de acesso baseado em roles
   - Controladores para login, refresh token e logout
   - Serviu00e7os para gerenciu00e1rio de tokens JWT

## Principais Componentes

### Backend

#### Middleware de Autenticau00e7u00e3o (`auth.js`)

O middleware de autenticau00e7u00e3o verifica se um token JWT vu00e1lido estu00e1 presente nas requisiu00e7u00f5es para rotas protegidas. As principais funu00e7u00f5es incluem:

1. **authenticate**: 
   - Verifica a existu00eancia e validade do token JWT no header `Authorization`
   - Decodifica o token e recupera o usuau00e1rio do banco de dados
   - Verifica se o usuau00e1rio estu00e1 ativo
   - Disponibiliza o objeto de usuau00e1rio na requisiu00e7u00e3o (`req.user`)

   ```javascript
   // Exemplo de uso do middleware authenticate
   router.get('/protected-route', authenticate, (req, res) => {
     // Se chegar aqui, o usuau00e1rio estu00e1 autenticado
     // req.user contu00e9m os dados do usuau00e1rio
   });
   ```

2. **authorize**: 
   - Verifica se o usuau00e1rio possui a role necessau00e1ria para acessar o recurso
   - Complementa o middleware `authenticate`

   ```javascript
   // Exemplo de uso do middleware authorize
   router.post('/admin-only', authenticate, authorize('admin'), (req, res) => {
     // Se chegar aqui, o usuau00e1rio estu00e1 autenticado e tem role 'admin'
   });
   ```

#### Cu00f3digos de Resposta HTTP

| Cu00f3digo | Significado                             | Cenu00e1rio                                      |
|-----------|----------------------------------------|-------------------------------------------|
| 200       | Sucesso                                | Login bem-sucedido, token refreshed       |
| 401       | Nu00e3o autorizado                         | Token ausente, invu00e1lido ou expirado        |
| 403       | Proibido                               | Usuau00e1rio inativo ou sem permissu00e3o          |
| 404       | Nu00e3o encontrado                        | Usuau00e1rio nu00e3o existe no sistema              |
| 500       | Erro interno                           | Falha inesperada no servidor             |

### Frontend

#### Contexto de Autenticau00e7u00e3o (`AuthContext.jsx`)

O contexto de autenticau00e7u00e3o gerencia o estado global de autenticau00e7u00e3o na aplicau00e7u00e3o, oferecendo:

- Armazenamento do usuau00e1rio logado
- Funu00e7u00f5es para login, logout e refresh de token
- Verificau00e7u00e3o de estado de autenticau00e7u00e3o

```javascript
// Exemplo de uso do AuthContext
const { user, login, logout, isAuthenticated } = useAuth();

// Verificar se usuau00e1rio estu00e1 autenticado
if (isAuthenticated) {
  // Realizar operau00e7u00f5es para usuau00e1rio logado
}

// Efetuar login
await login(email, password);

// Efetuar logout
logout();
```

#### Guarda de Rotas (`AuthGuard.jsx`)

O componente AuthGuard protege rotas que requerem autenticau00e7u00e3o, redirecionando usuau00e1rios nu00e3o autenticados para a pu00e1gina de login.

```jsx
// Exemplo de uso do AuthGuard no roteamento
<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
</Routes>
```

## Fluxo de Autenticau00e7u00e3o

1. **Login**:
   - Usuau00e1rio submete credenciais (email/senha)
   - Backend valida credenciais
   - Se vu00e1lidas, backend gera token JWT e refresh token
   - Tokens su00e3o armazenados no localStorage do navegador
   - Usuau00e1rio u00e9 redirecionado para o dashboard

2. **Acesso a Rotas Protegidas**:
   - O AuthGuard verifica se existe um token JWT no localStorage
   - Requisiu00e7u00f5es para API incluem o token no header Authorization
   - Backend valida o token em cada requisiu00e7u00e3o
   - Se o token for invu00e1lido ou expirado, o usuau00e1rio u00e9 redirecionado para login

3. **Refresh Token**:
   - Quando o token principal expira, o refresh token u00e9 usado para obter um novo
   - Se o refresh token for vu00e1lido, um novo token JWT u00e9 emitido
   - Se o refresh token for invu00e1lido, o usuau00e1rio u00e9 deslogado e redirecionado

4. **Logout**:
   - Tokens su00e3o removidos do localStorage
   - Estado de autenticau00e7u00e3o u00e9 limpo
   - Usuau00e1rio u00e9 redirecionado para a pu00e1gina de login

## Testes Implementados

### Testes de Backend

1. **Middleware de Autenticau00e7u00e3o**:
   - Teste para token ausente (status 401)
   - Teste para token invu00e1lido (status 401)
   - Teste para usuau00e1rio nu00e3o encontrado (status 404)
   - Teste para usuau00e1rio inativo (status 403)
   - Teste para autenticau00e7u00e3o bem-sucedida

2. **Middleware de Autorizau00e7u00e3o**:
   - Teste para usuau00e1rio nu00e3o autenticado (status 401)
   - Teste para usuau00e1rio sem permissu00e3o (status 403)
   - Teste para autorizau00e7u00e3o bem-sucedida

### Testes de Frontend

1. **Componente de Login**:
   - Teste de renderizau00e7u00e3o
   - Teste de submissu00e3o do formuu00e1rio
   - Teste de mensagens de erro
   - Teste de redirecionamento apu00f3s login

2. **AuthContext**:
   - Teste de inicializau00e7u00e3o
   - Teste da funu00e7u00e3o de login
   - Teste da funu00e7u00e3o de logout
   - Teste de estado de autenticau00e7u00e3o

3. **AuthGuard**:
   - Teste de redirecionamento para login quando nu00e3o autenticado
   - Teste de renderizau00e7u00e3o de componente filho quando autenticado

## Segurana

- Tokens JWT com expiração curta (1 hora padrão)
- Refresh tokens com expiração mais longa (7 dias padrão)
- Senha armazenada com hash bcrypt
- HTTPS para todas as comunicações
- Proteção contra CSRF e XSS
- Verificação de usuário ativo antes de autorizar acesso

## Considerações de Implementação

1. **Gerenciamento de Tokens**:
   - Tokens são armazenados no localStorage (alternativa: httpOnly cookies)
   - Refresh tokens são utilizados para renovar tokens expirados

2. **Mocks para Testes**:
   - Utilização de mocks em vez de MongoDB Memory Server
   - Mocks simplificados para JWT e modelos do Mongoose

3. **Segurança**:
   - Validação de tokens em cada requisição
   - Verificação de usuário ativo
   - Controle granular de acesso baseado em roles

## Conclusão

O sistema de autenticação do Lyz Healthcare fornece uma solução robusta e testada para controle de acesso à aplicação. A arquitetura em camadas e a separação de responsabilidades permitem fácil manutenção e extensão, enquanto os testes automatizados garantem a confiabilidade do sistema.
