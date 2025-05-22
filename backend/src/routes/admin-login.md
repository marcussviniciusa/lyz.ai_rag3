# Rota de Login Administrativo

## Visu00e3o Geral

Esta documentau00e7u00e3o descreve a implementau00e7u00e3o da rota de login administrativo adicional criada para resolver problemas de autenticau00e7u00e3o no sistema Lyz Healthcare. Esta rota foi implementada como uma soluu00e7u00e3o temporu00e1ria para permitir o acesso administrativo enquanto a rota de autenticau00e7u00e3o regular u00e9 ajustada.

## Detalhes da Implementau00e7u00e3o

### Endpoint

```
POST /admin-login
```

### Parau00e2metros de Requisiu00e7u00e3o

| Parau00e2metro | Tipo   | Obrigatu00f3rio | Descriu00e7u00e3o                  |
|--------------|--------|--------------|------------------------------|
| email        | String | Sim          | Email do usuu00e1rio administrador |
| password     | String | Sim          | Senha do usuu00e1rio               |

### Formato da Requisiu00e7u00e3o

```json
{
  "email": "admin@exemplo.com",
  "password": "senhaSegura123"
}
```

### Resposta de Sucesso

- **Cu00f3digo:** 200 OK
- **Conteudo:**

```json
{
  "success": true,
  "message": "Login administrativo realizado com sucesso",
  "user": {
    "id": "id_do_usuario",
    "name": "Nome do Usuu00e1rio",
    "email": "email@exemplo.com",
    "role": "superadmin"
  },
  "tokens": {
    "access": "jwt_access_token",
    "refresh": "jwt_refresh_token"
  }
}
```

### Respostas de Erro

#### Usuu00e1rio Nu00e3o Encontrado

- **Cu00f3digo:** 404 Not Found
- **Conteudo:**

```json
{
  "success": false,
  "message": "Usuu00e1rio nu00e3o encontrado",
  "debug": { "emailBuscado": "email@exemplo.com" }
}
```

#### Credenciais Invu00e1lidas

- **Cu00f3digo:** 401 Unauthorized
- **Conteudo:**

```json
{
  "success": false,
  "message": "Credenciais invu00e1lidas",
  "debug": { "senhaCorreta": false }
}
```

#### Erro Interno

- **Cu00f3digo:** 500 Internal Server Error
- **Conteudo:**

```json
{
  "success": false,
  "message": "Erro ao processar login administrativo",
  "error": "Mensagem de erro"
}
```

## Fluxo de Execuu00e7u00e3o

1. A requisiu00e7u00e3o u00e9 recebida com email e senha
2. O sistema busca o usuu00e1rio pelo email fornecido
3. Se o usuu00e1rio nu00e3o for encontrado, retorna erro 404
4. Se o usuu00e1rio for encontrado, verifica a senha usando bcrypt
5. Se a senha estiver incorreta, retorna erro 401
6. Se a autenticau00e7u00e3o for bem-sucedida:
   - Gera tokens JWT de acesso e refresh
   - Atualiza o timestamp de u00faltimo login do usuu00e1rio
   - Retorna os dados do usuu00e1rio e os tokens

## Observau00e7u00f5es de Segurana

- Esta rota utiliza bcrypt para validau00e7u00e3o segura de senhas
- Os tokens JWT gerados conteu00eam informau00e7u00f5es sobre o ID e papel do usuu00e1rio
- O token de acesso expira apu00f3s 1 hora
- O token de refresh expira apu00f3s 7 dias

## Considerau00e7u00f5es para Produu00e7u00e3o

**IMPORTANTE**: Esta rota foi implementada como soluu00e7u00e3o temporu00e1ria e deve ser removida apu00f3s a correu00e7u00e3o da rota de autenticau00e7u00e3o regular do sistema. A existu00eancia desta rota em ambientes de produu00e7u00e3o pode representar um risco de segurana.
