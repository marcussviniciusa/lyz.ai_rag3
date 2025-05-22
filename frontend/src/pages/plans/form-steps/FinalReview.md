# Documentação do Componente FinalReview

## Visão Geral
O componente `FinalReview` implementa a última etapa do processo de criação de planos de saúde personalizados no sistema Lyz. Ele fornece uma visualização consolidada de todos os dados coletados durante as etapas anteriores do formulário, permitindo uma revisão completa antes da geração do plano final com IA.

## Funcionalidades Principais

### 1. Resumo Visual Consolidado
- **Visão Abrangente**: Apresentação de todos os dados coletados em um único local
- **Organização por Seções**: Divisão em cards e acordeons por área funcional
- **Priorização Visual**: Destaque para informações críticas como sintomas de alta prioridade
- **Agrupamento Lógico**: Organização de dados em categorias relacionadas

### 2. Navegação Facilitada
- **Acordeons Expansíveis**: Acesso rápido a detalhes específicos quando necessário
- **Colapso de Seções**: Minimização de áreas não relevantes para foco seletivo
- **Design Responsivo**: Adaptação para diferentes tamanhos de tela
- **Hierarquia Visual**: Identificação clara das diferentes seções por ícones e cores

### 3. Revisão Inteligente
- **Filtragem de Dados**: Exibição dos itens mais relevantes em listas extensas
- **Formatação Contextual**: Apresentação adaptada ao tipo de dado (chips, listas, tabelas)
- **Codificação por Cores**: Indicação visual de severidade e prioridade
- **Indicadores de Completude**: Feedback sobre seções não preenchidas ou incompletas

### 4. Finalização do Plano
- **Campo de Notas Adicionais**: Entrada para observações finais e contexto
- **Atualização em Tempo Real**: Sincronização imediata com o estado do formulário
- **Preparação para IA**: Estruturação dos dados para processamento pelo LangChain
- **Transição Visual**: Animações que indicam a conclusão do processo de coleta de dados

## Interface do Usuário

### 1. Cabeçalho e Introdução
- **Título e Descrição**: Contextualização da etapa final do processo
- **Instruções Claras**: Orientação para revisão e adição de notas complementares
- **Animação de Entrada**: Transição suave com Framer Motion

### 2. Card de Dados Pessoais
- **Informações Básicas**: Nome, idade, contato e detalhes físicos
- **Avatar e Ícones**: Identificação visual da seção
- **Layout em Grid**: Organização em colunas para visualização eficiente

### 3. Acordeons Temáticos
- **Histórico Menstrual**: Ciclo, regularidade, TPM e status de menopausa
- **Sintomas**: Lista priorizada com indicadores visuais de severidade
- **Histórico de Saúde**: Condições, medicações e suplementos
- **Estilo de Vida**: Dieta, exercícios, sono e estresse
- **Resultados de Exames**: Arquivos enviados e resultados relevantes
- **Medicina Tradicional Chinesa**: Avaliações de pulso, língua e cinco elementos
- **Matriz IFM**: Visualização das áreas avaliadas com pontuação
- **Linha do Tempo**: Eventos significativos em ordem cronológica

### 4. Seção de Notas
- **Campo de Texto Multilinha**: Espaço para observações adicionais
- **Instruções Contextuais**: Sugestões para informações complementares
- **Atualização Instantânea**: Sincronização com o estado global do formulário

## Interação com o Estado

### 1. Recebimento de Dados
- O componente recebe todos os dados coletados via prop `data.fullPlan`
- Acesso a informações detalhadas de todas as etapas anteriores
- Utilização de desestruturação para facilitar o acesso aos dados

### 2. Atualização de Notas
- Estado local para gerenciar o campo de notas adicionais
- Sincronização bidirecional com o estado global via prop `onChange`
- Atualização imediata no formulário principal

## Recursos Visuais

### 1. Animações
- **Entrada Sequencial**: Aparecimento progressivo das seções
- **Efeito Stagger**: Temporização entre os elementos para fluidez visual
- **Transições Suaves**: Movimentos naturais para melhor experiência

### 2. Componentes Visuais
- **Chips**: Representação de itens em listas (sintomas, medicações)
- **Avatares**: Indicadores visuais para prioridade e categorias
- **Cards**: Agrupamento de informações relacionadas
- **Acordeons**: Expansão e colapso de seções detalhadas

## Formatação de Dados

### 1. Tratamento de Dados Ausentes
- Verificação de valores nulos ou indefinidos
- Exibição de mensagens apropriadas para campos não preenchidos
- Prevenção de erros em renderização condicional

### 2. Formatação de Datas
- Conversão de strings ISO para formato localizado (pt-BR)
- Tratamento de casos nulos com mensagens adequadas
- Função utilitária `formatDate` para padronização

### 3. Exibição Limitada
- Truncamento de listas muito longas com indicador de "mais itens"
- Priorização de itens mais relevantes ou recentes
- Exibição de contagem total para contexto

## Responsividade

### 1. Layout Adaptativo
- **Grid Responsivo**: Alteração de colunas conforme o tamanho da tela
- **Densidade de Informação**: Ajuste de espaçamento e tamanho de texto
- **Empilhamento em Mobile**: Reorganização de elementos em telas pequenas

### 2. Componentes Flexíveis
- Uso de `Box` e `Grid` para layouts fluidos
- Propriedades responsivas em componentes do Material UI
- Ajuste automático de conteúdo para diferentes dispositivos

## Conexão com a IA

O resumo visual criado pelo componente FinalReview serve como base para a geração do plano personalizado, fornecendo à IA (LangChain) uma visão estruturada e completa dos dados da paciente para processamento e análise. As notas adicionais permitem incluir contexto e objetivos específicos que guiarão as recomendações geradas.
