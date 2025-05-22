# Documentação do Componente Dashboard

## Visão Geral
O Dashboard é a interface central do sistema Lyz, fornecendo uma visão geral das informações e recursos principais para o usuário. Ele apresenta estatísticas, planos recentes, atividades do sistema e funcionalidades administrativas para superadministradores.

## Componentes

### StatCard
Componente de estatística animado que exibe métricas importantes com ícones e cores personalizadas.

**Props:**
- `icon`: Componente de ícone do Material UI
- `title`: Título da estatística
- `value`: Valor numérico a ser exibido
- `color`: Cor do tema a ser aplicada
- `delay`: Atraso na animação para criar efeito sequencial

### PlanCard
Card que exibe informações resumidas de um plano de saúde com animações de entrada e hover.

**Props:**
- `plan`: Objeto contendo dados do plano
- `index`: Índice para cálculo do atraso na animação
- `onView`: Função de callback para visualização do plano

### RecentActivity
Componente que exibe atividades recentes do sistema em formato de lista.

**Props:**
- `activities`: Array de objetos de atividade contendo título, descrição, tempo, ícone e cor

## Funcionalidades

### Para Todos os Usuários
- Visualização de estatísticas gerais (total de planos, planos finalizados, pacientes)
- Lista de planos recentes com acesso rápido aos detalhes
- Histórico de atividades recentes do sistema
- Botão para criação de novos planos

### Para Superadministradores
- Seção adicional com acesso aos recursos administrativos
- Links para gerenciamento de empresas e usuários

## Estados e Hooks

- `loading`: Controla o estado de carregamento de dados
- `stats`: Armazena estatísticas do dashboard
- `recentPlans`: Lista de planos recentes
- `activities`: Lista de atividades recentes geradas
- `user`: Informações do usuário atual
- `isSuperAdmin`: Flag para verificação de permissões de superadministrador

## Efeitos de Animação

O componente utiliza a biblioteca Framer Motion para criar uma experiência visual dinâmica:

- Animações de entrada suaves com delays sequenciais
- Efeitos de hover nos cards de planos e estatísticas
- Transições de opacidade e movimento para diferentes seções

## Integração com Serviços

- `PlanService`: Obtenção de estatísticas e listagem de planos
- `UserService`: Acesso a informações de usuários (preparado para implementação futura)
- `AuthService`: Verificação de permissões e dados do usuário atual

## Design Responsivo

O layout é totalmente responsivo, adaptando-se a diferentes tamanhos de tela:

- Layout em grade para dispositivos desktop
- Empilhamento de componentes em telas menores
- Espaçamento e dimensionamento adaptados para experiência móvel

## Rotas de Navegação

- `/plans/new`: Criação de novo plano
- `/plans/:id`: Visualização de detalhes de um plano
- `/plans`: Listagem completa de planos
- `/admin/companies`: Gerenciamento de empresas (somente superadmin)
- `/admin/users`: Gerenciamento de usuários (somente superadmin)

## Recursos Futuros

O componente inclui uma seção de calendário de consultas, indicada como funcionalidade futura do sistema.
