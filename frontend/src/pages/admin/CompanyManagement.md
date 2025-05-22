# Documentação do Componente CompanyManagement

## Visão Geral
O componente CompanyManagement é uma interface administrativa para gerenciamento de empresas no sistema Lyz. Ele permite que superadministradores visualizem, criem, editem e excluam empresas, além de controlar limites de tokens e monitorar o uso destes recursos.

## Recursos Principais

### 1. Listagem de Empresas
- Tabela paginada com informações das empresas
- Colunas para nome, descrição, contato, tokens e status
- Indicador visual de uso de tokens com barra de progresso
- Chips coloridos para indicação de status (ativa/inativa)
- Paginação e configuração de itens por página

### 2. Filtragem e Busca
- Campo de busca por texto (nome ou descrição)
- Filtro rápido por status (apenas empresas ativas)
- Botão para limpar todos os filtros

### 3. Gerenciamento de Empresas
- Criação de novas empresas
- Edição de dados de empresas existentes
- Exclusão de empresas com confirmação
- Interface visual intuitiva com animações

### 4. Gerenciamento de Tokens
- Visualização do consumo de tokens por empresa
- Barra de progresso indicando porcentagem de uso
- Diálogo específico para ajustar limites de tokens
- Alerta visual quando o consumo está próximo do limite

## Estados Principais

### Estados de Dados
- `companies`: Array contendo a lista de empresas
- `totalCompanies`: Total de empresas para paginação
- `loading`: Flag para indicar carregamento

### Estados de UI
- `page` e `rowsPerPage`: Controle de paginação
- `searchTerm` e `statusFilter`: Filtros aplicados
- `alert`: Informações de notificação (mensagem, tipo)
- `deleteDialog`: Controle do diálogo de exclusão
- `companyDialog`: Controle do diálogo de criação/edição
- `tokenDialog`: Controle do diálogo de gerenciamento de tokens
- `formData`: Dados do formulário de empresa

## Diálogos

### Diálogo de Empresa
- Modo de criação e edição em um único componente
- Campos para nome, descrição, email, telefone, limite de tokens e status
- Switch para ativar/desativar a empresa
- Validação de campos obrigatórios

### Diálogo de Tokens
- Visualização detalhada do uso de tokens
- Barra de progresso colorida baseada na porcentagem de uso
- Campo para atualização do limite de tokens
- Informação sobre tokens já utilizados

### Diálogo de Confirmação
- Solicita confirmação antes da exclusão
- Alerta sobre o impacto em usuários e planos vinculados

## Integração com Serviços

### CompanyService
- `getCompanies`: Obtem lista filtrada e paginada
- `getCompany`: Busca detalhes de uma empresa específica
- `createCompany`: Cria nova empresa
- `updateCompany`: Atualiza dados de empresa existente
- `deleteCompany`: Remove uma empresa
- `updateTokenLimit`: Atualiza o limite de tokens
- `getCompanyStats`: Obtém estatísticas de uso

## Animações

O componente utiliza Framer Motion para animações:
- Entrada com fade in e movimento para o cabeçalho
- Sequenciamento de animações com delays
- Transições suaves entre estados de UI

## Tratamento de Erros

- Captura e exibe erros de API
- Feedback visual com alertas de tipo "error"
- Mensagens contextualizadas para cada tipo de operação

## Segurança e Permissões

- Interface disponível apenas para usuários com role "superadmin"
- Proteção de rotas no backend
- Validação de dados antes do envio

## Funcionalidades de Negócio

- Gerenciamento de limite de recursos por empresa
- Monitoramento de consumo de tokens
- Vinculação lógica entre empresas, usuários e planos
- Controle de acesso granular ao sistema
