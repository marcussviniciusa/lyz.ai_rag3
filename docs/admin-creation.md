# Criau00e7u00e3o de Usuu00e1rio Administrador

## Visu00e3o Geral

Este documento descreve o processo de criau00e7u00e3o do primeiro usuu00e1rio administrador no sistema Lyz Healthcare, uma etapa essencial para a configurau00e7u00e3o inicial do sistema.

## Script de Criau00e7u00e3o

O sistema utiliza um script personalizado (`scripts/create-admin-user.js`) para facilitar a criau00e7u00e3o do primeiro usuu00e1rio administrador e da primeira empresa no sistema. O script utiliza o MongoDB para armazenar os dados e cria as estruturas necessau00e1rias.

## Pru00e9-requisitos

- Node.js instalado
- MongoDB configurado e acessu00edvel
- Arquivo `.env` configurado com as credenciais do MongoDB
- Dependu00eancias instaladas (`mongoose`, `bcryptjs`, `dotenv`)

## Processo de Criau00e7u00e3o

O script guia o administrador por um processo interativo que inclui:

1. **Criau00e7u00e3o da Empresa**
   - Nome da empresa
   - Limite de tokens (valor padru00e3o: 100000)

2. **Criau00e7u00e3o do Usuu00e1rio Administrador**
   - Nome completo
   - Email (serau00e1 usado para login)
   - Senha (mu00ednimo 8 caracteres, armazenada com hash seguro)
   
## Modelos de Dados

### Empresa (Company)

```javascript
const companySchema = new mongoose.Schema({
  name: String,          // Nome da empresa
  active: Boolean,       // Status da empresa (ativo/inativo)
  token_limit: Number,   // Limite de tokens disponiu00edveis
  tokens_used: Number,   // Tokens ju00e1 utilizados
  created_at: Date,      // Data de criau00e7u00e3o
  updated_at: Date       // Data de atualizau00e7u00e3o
});
```

### Usuu00e1rio (User)

```javascript
const userSchema = new mongoose.Schema({
  curseduca_id: String,  // ID u00fanico no sistema
  name: String,          // Nome completo do usuu00e1rio
  email: String,         // Email (usado para login)
  password: String,      // Senha com hash
  role: String,          // Funu00e7u00e3o (superadmin, user)
  company_id: ObjectId,  // Referencia da empresa vinculada
  active: Boolean,       // Status do usuu00e1rio
  last_login: Date,      // u00daltimo acesso
  created_at: Date,      // Data de criau00e7u00e3o
  updated_at: Date       // Data de atualizau00e7u00e3o
});
```

## Execuu00e7u00e3o do Script

```bash
cd /home/m/lyz.ai_rag3
node scripts/create-admin-user.js
```

## Segurana

- As senhas su00e3o armazenadas com hash bcrypt (fator de custo 10)
- Validau00e7u00e3o de seguranu00e7a para senha (mu00ednimo 8 caracteres)
- Verificau00e7u00e3o de dados duplicados (email, ID Curseduca)

## Apu00f3s a Criau00e7u00e3o

O administrador pode acessar o sistema pela URL do frontend:
- http://localhost:3000/auth/login

Com o acesso de superadmin, u00e9 possu00edvel realizar todas as operau00e7u00f5es administrativas:
- Gerenciar empresas e usuu00e1rios
- Configurar o sistema
- Monitorar o uso de tokens
- Acessar todas as funcionalidades do Lyz Healthcare System
