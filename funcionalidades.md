# Funcionalidades do Sistema Lyz

- [x] Ferramentas Administrativas
  - [x] Script de criação do primeiro usuário administrador
  - [x] Geração automática de empresa e vinculação de usuário
- [x] Níveis de Acesso (Superadministrador e Usuário)
- [x] Dashboard Executivo para Superadministradores
- [x] Gerenciamento de Empresas
- [x] Gerenciamento de Usuários
- [x] Configuração de Prompts para IA
- [x] Monitoramento de Tokens
- [x] Gestão de Planos para Usuários
- [x] Fluxo de Criação de Planos
  - [x] Cadastro Inicial da Paciente (PatientInfo)
    - [x] Informações básicas (nome, idade, peso, altura)
    - [x] Dados de contato e identificação
    - [x] Métricas antropométricas
  - [x] Histórico Menstrual (MenstrualHistory)
    - [x] Detalhes do ciclo menstrual
    - [x] Sintomas pré-menstruais
    - [x] Histórico de métodos contraceptivos
  - [x] Gestão de Sintomas (SymptomsForm)
    - [x] Adição e edição de sintomas
    - [x] Priorização de sintomas
    - [x] Classificação por intensidade, duração e frequência
    - [x] Identificação de gatilhos
  - [x] Histórico de Saúde (HealthHistory)
    - [x] Condições médicas prévias e atuais
    - [x] Medicações e suplementos
    - [x] Cirurgias realizadas
    - [x] Alergias e restrições
    - [x] Histórico familiar
  - [x] Estilo de Vida (LifestyleForm)
    - [x] Perfil alimentar e restrições dietéticas
    - [x] Atividade física e exercícios
    - [x] Padrões de sono
    - [x] Níveis de estresse e estratégias de gestão
    - [x] Ocupação e exposição ambiental
  - [x] Análise de Exames (LabResults)
    - [x] Registro categorizado de exames laboratoriais
    - [x] Upload e gerenciamento de arquivos de exames
    - [x] Registro de resultados com valores de referência
    - [x] Visualização integrada de documentos e imagens
    - [x] Validação de formatos e tamanhos de arquivo
  - [x] Medicina Tradicional Chinesa (TraditionalChineseMedicine)
    - [x] Avaliação constitucional e dos cinco elementos
    - [x] Diagnóstico por língua e pulso
    - [x] Identificação de padrões de desarmonia
    - [x] Avaliação de meridianos e órgãos
    - [x] Balanço Yin-Yang
  - [x] Linha do Tempo Funcional (FunctionalTimeline)
    - [x] Registro cronológico de eventos significativos
    - [x] Categorização por tipo e impacto na saúde
    - [x] Visualização em linha do tempo interativa
    - [x] Identificação de correlações entre eventos e sintomas
    - [x] Documentação de eventos em andamento e concluídos
  - [x] Matriz IFM (IFMMatrix)
    - [x] Avaliação de 16 nós funcionais da medicina funcional
    - [x] Pontuação e classificação de desequilíbrios
    - [x] Documentação de observações clínicas por sistema
    - [x] Recomendações personalizadas por área
    - [x] Visualização gráfica da matriz integrada
  - [x] Geração do Plano
  - [x] Exportação
- [x] Interface Responsiva e Experiência do Usuário
  - [x] Animações com Framer Motion
  - [x] Design responsivo para dispositivos móveis e desktop
  - [x] Feedback visual para interações do usuário
- [x] Integração com IA (LangChain)
  - [x] Geração de planos personalizados
  - [x] Análise de dados da paciente
  - [x] Recomendações baseadas em ciclicidade feminina

# Próximos Passos do Desenvolvimento

## 1. Integração dos Componentes no Formulário Principal
- [x] Atualizar o PlanForm.jsx para incluir todos os novos componentes
- [x] Implementar navegação fluida entre as etapas do formulário
- [x] Adicionar barra de progresso para acompanhamento das etapas
- [x] Persistir dados entre navegações de etapas
- [x] Implementar validação de dados por etapa
- [x] Criar resumo visual consolidado antes da finalização (FinalReview)

## 2. Aprimoramento da Integração com LangChain
- [x] Estruturar os dados coletados para processamento pela IA
  - [x] Documentação detalhada da arquitetura de integração
  - [x] Mapeamento da estrutura de dados entre frontend e backend
  - [x] Implementação inicial do serviço LangChain aprimorado
- [x] Desenvolver prompts específicos para cada seção do plano
  - [x] Prompt especializado para análise de exames laboratoriais
  - [x] Prompt especializado para Medicina Tradicional Chinesa
  - [x] Prompt especializado para Matriz IFM com 16 nós
  - [x] Prompt especializado para Linha do Tempo Funcional
  - [x] Prompt principal para geração do plano personalizado
- [x] Finalizar implementação do serviço LangChain aprimorado
  - [x] Método de processamento da Linha do Tempo Funcional
  - [x] Método de processamento da Matriz IFM expandida
  - [x] Método de processamento da MTC expandida
  - [x] Extração de recomendações categorizadas
- [x] Implementar chamadas assíncronas com feedback visual
  - [x] Indicadores de progresso no frontend
  - [x] Estimativa de tempo restante
  - [x] Notificações em tempo real
- [x] Criar mecanismos de fallback para falhas na API
  - [x] Retry automático para falhas temporárias
  - [x] Salvamento parcial de resultados
  - [x] Modo offline para visualização de dados
- [x] Otimizar o uso de tokens nas requisições
  - [x] Implementar serviço dedicado para otimização de tokens
  - [x] Estratégias de compressão semântica para reduzir tokens
  - [x] Monitoramento em tempo real do uso de tokens por categoria
- [x] Sistema de cache avançado
  - [x] Cache em memória para respostas frequentes
  - [x] Persistência de dados para uso entre reinícios
  - [x] TTL configurável por tipo de dado
  - [x] Invalidação inteligente baseada em alterações nos dados
  - [x] Compressão inteligente de dados
  - [x] Priorização de informações relevantes
  - [x] Métricas de uso por empresa/usuário
- [x] Implementar cache para resultados recorrentes
  - [x] Sistema de cache em memória
  - [x] Invalidação controlada de cache
  - [x] Persistência de resultados frequentes

## 3. Desenvolvimento de Testes
### 3.1. Testes de Frontend
- [ ] Criar testes unitários para componentes React
  - [ ] Testes para componentes de formulário de planos
  - [ ] Testes para serviços de integração com API
  - [ ] Testes para componentes de UI compartilhados
- [ ] Implementar testes de integração para fluxos de usuário
  - [ ] Fluxo completo de criação de plano
  - [ ] Fluxo de gerenciamento de usuários e empresas
  - [ ] Fluxo de exportação e compartilhamento de planos

### 3.2. Testes de Backend
- [ ] Criar testes unitários para serviços
  - [ ] Testes para o serviço LangChain aprimorado
  - [ ] Testes para serviços de armazenamento MinIO
  - [ ] Testes para serviços de autenticação e autorização
- [ ] Implementar testes de integração para APIs
  - [ ] Testes para endpoints de planos
  - [ ] Testes para endpoints de usuários e empresas
  - [ ] Testes para geração de planos com LangChain

### 3.3. Testes de Sistema
- [ ] Desenvolver testes end-to-end para simular uso real
  - [ ] Cenários completos de uso da aplicação
  - [ ] Testes de performance e carga
  - [ ] Testes de responsividade em diferentes dispositivos
- [ ] Configurar CI/CD para execução automática de testes
  - [ ] Pipeline de integração contínua
  - [ ] Validação automática em pull requests
  - [ ] Deployment automático após testes bem-sucedidos
- [ ] Implementar testes de regressão
  - [ ] Suíte de testes para funcionalidades críticas
  - [ ] Monitoramento de regressões em atualizações
- [ ] Garantir cobertura mínima de 80% do código
  - [ ] Configurar relatórios de cobertura
  - [ ] Identificar áreas críticas para teste prioritário

## 4. Refinação da Experiência do Usuário
- [ ] Otimizar desempenho e tempo de carregamento
- [ ] Implementar salvamento automático de rascunhos
- [ ] Melhorar acessibilidade dos componentes
- [ ] Adicionar tooltips e ajudas contextuais
- [ ] Implementar notificações e alertas inteligentes
- [ ] Criar templates e exemplos pré-preenchidos

## 5. Documentação e Treinamento
- [ ] Finalizar documentação técnica da API
- [ ] Criar guias passo-a-passo para usuários
- [ ] Documentar arquitetura e decisões de design
- [ ] Implementar sistema de ajuda in-app
- [ ] Preparar materiais de treinamento
- [ ] Desenvolver documentation do código com JSDoc
- [x] Infraestrutura (MongoDB, MinIO)
  - [x] Armazenamento de dados estruturados
  - [x] Gestão de arquivos e documentos
  - [x] Backup e recuperação
- [ ] Gestão de Conteúdo
- [x] Integração com Curseduca
