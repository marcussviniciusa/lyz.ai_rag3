# Documentau00e7u00e3o do Componente UserManagement

## Visu00e3o Geral
O componente UserManagement u00e9 uma interface administrativa para gerenciamento de usuu00e1rios no sistema Lyz. Ele permite que superadministradores visualizem, criem, editem e excluam usuu00e1rios, alm de realizar filtragem e paginau00e7u00e3o dos dados.

## Recursos Principais

### 1. Listagem de Usuu00e1rios
- Tabela paginada com informau00e7u00f5es dos usuu00e1rios
- Colunas para nome, e-mail, empresa, funu00e7u00e3o e status
- Indicadores visuais (chips) para status e nvel de acesso
- Paginau00e7u00e3o e configuracu00e3o de itens por pu00e1gina

### 2. Filtragem Avanou00e7ada
- Busca por texto (nome ou email)
- Filtro por status (ativo/inativo)
- Filtro por empresa
- Botu00e3o para limpar todos os filtros

### 3. Gerenciamento de Usuu00e1rios
- Criau00e7u00e3o de novos usuu00e1rios
- Ediu00e7u00e3o de dados de usuu00e1rios existentes
- Alterau00e7u00e3o de senha (opcional na ediu00e7u00e3o)
- Exclusu00e3o de usuu00e1rios com confirmau00e7u00e3o

### 4. Interface Responsiva
- Layout adaptativo para diferentes tamanhos de tela
- Elementos visuais organizados em grade responsiva
- Componentes de animau00e7u00e3o para melhor UX

## Estados Principais

### Estados de Dados
- `users`: Array contendo a lista de usuu00e1rios
- `companies`: Array de empresas para os seletores
- `totalUsers`: Total de usuu00e1rios para paginau00e7u00e3o
- `loading`: Flag para indicar carregamento

### Estados de UI
- `page` e `rowsPerPage`: Controle de paginau00e7u00e3o
- `searchTerm`, `statusFilter`, `companyFilter`: Filtros aplicados
- `alert`: Informau00e7u00f5es de notificau00e7u00e3o (mensagem, tipo)
- `deleteDialog`: Controle do diu00e1logo de exclusu00e3o
- `userDialog`: Controle do diu00e1logo de criau00e7u00e3o/ediu00e7u00e3o
- `formData`: Dados do formulu00e1rio de usuu00e1rio

## Diu00e1logos

### Diu00e1logo de Usuu00e1rio
- Modo de criau00e7u00e3o e ediu00e7u00e3o em um u00fanico componente
- Campos para nome, email, senha, funu00e7u00e3o, empresa e status
- Validau00e7u00e3o de campos obrigatu00f3rios
- Senha opcional para ediu00e7u00e3o

### Diu00e1logo de Confirmau00e7u00e3o
- Solicita confirmau00e7u00e3o antes da exclusu00e3o
- Previne exclusu00f5es acidentais

## Integracu00e7u00e3o com Serviu00e7os

### UserService
- `getUsers`: Obtem lista filtrada e paginada
- `getUser`: Busca detalhes de um usuu00e1rio especfico
- `createUser`: Cria novo usuu00e1rio
- `updateUser`: Atualiza dados de usuu00e1rio existente
- `deleteUser`: Remove um usuu00e1rio

### CompanyService
- `getCompanies`: Obtem lista de empresas para filtros e seleu00e7u00e3o

## Animau00e7u00f5es

O componente utiliza Framer Motion para animau00e7u00f5es:
- Entrada com fade in e movimento para o cabeu00e7alho
- Sequenciamento de animau00e7u00f5es com delays
- Animau00e7u00f5es em diferentes direu00e7u00f5es (y e opacidade)

## Tratamento de Erros

- Captura e exibe erros de API
- Feedback visual com alertas de tipo "error"
- Mensagens contextualizadas para cada tipo de erro

## Segurana e Permissu00f5es

- Interface disponvel apenas para usuu00e1rios com role "superadmin"
- Protecu00e7u00e3o de rotas no backend
- Validau00e7u00e3o de dados antes do envio
