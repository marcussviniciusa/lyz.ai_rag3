# Script de Criau00e7u00e3o de Administrador

## Visu00e3o Geral
Este script permite a criau00e7u00e3o do primeiro usuu00e1rio administrador e empresa no sistema Lyz. O script interage com o banco de dados MongoDB para criar registros de empresa e usuu00e1rio com perfil de superadministrador.

## Requisitos
- Node.js instalado
- Acesso ao banco de dados MongoDB
- Arquivo `.env` configurado no diretório `backend`

## Funcionalidades

### Criau00e7u00e3o de Empresa
- Cria um registro de empresa na base de dados
- Define um limite de tokens para a empresa
- Marca a empresa como ativa

### Criau00e7u00e3o de Usuu00e1rio Administrador
- Cria um usuu00e1rio com role de `superadmin`
- Associa o usuu00e1rio u00e0 empresa criada
- Armazena a senha de forma segura com hash e salt
- Gera um ID Curseduca exclusivo para o usuu00e1rio

## Como Executar

```bash
node scripts/create-admin-user.js
```

O script vai guiu00e1-lo por uma su00e9rie de perguntas:

1. **Informau00e7u00f5es da Empresa**:
   - Nome da empresa
   - Limite de tokens (opcional, padru00e3o: 100000)

2. **Informau00e7u00f5es do Administrador**:
   - Nome completo
   - Email
   - Senha (mu00ednimo 8 caracteres)

## Segurana
- Validau00e7u00e3o de senha com mu00ednimo de 8 caracteres
- Senhas armazenadas com hash bcrypt
- Verificau00e7u00e3o de dados duplicados

## Tratamento de Erros
- Detecta tentativas de criar empresas ou usuu00e1rios duplicados
- Fornece mensagens de erro claras e informativas
- Fecha conexu00f5es com o banco de dados mesmo em caso de falha

## Detalhes Tu00e9cnicos

### Modelos Utilizados
- `Company`: Para criau00e7u00e3o de empresas
- `User`: Para criau00e7u00e3o de usuu00e1rios administradores

### Biblioteca de Linha de Comando
- Utiliza o mu00f3dulo `readline` do Node.js para interau00e7u00e3o com o usuu00e1rio

### Dependu00eancias
- mongoose: Para conexu00e3o com MongoDB
- bcryptjs: Para hash de senha
- dotenv: Para leitura de varu00e1veis de ambiente
- readline: Para interau00e7u00e3o via linha de comando
