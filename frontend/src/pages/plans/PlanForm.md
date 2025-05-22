# Documentação do Componente PlanForm

## Visão Geral
O componente `PlanForm` é o núcleo do processo de criação e edição de planos de saúde personalizados no sistema Lyz. Ele implementa um fluxo de formulário multi-etapas que guia o usuário pelo processo completo de coleta de informações da paciente, desde dados básicos até a geração do plano final usando inteligência artificial.

## Funcionalidades Principais

### 1. Formulário Multi-etapas
- Implementação de um Stepper do Material UI para navegação entre etapas
- 10 etapas sequenciais para coleta completa de informações
- Transições animadas entre etapas usando Framer Motion
- Validação de dados por etapa para garantir informações obrigatórias
- Persistência de dados entre navegações de etapas

### 2. Gerenciamento de Dados
- Estado centralizado para todos os dados do plano
- Atualização modular por seção conforme o usuário preenche o formulário
- Persistência de dados via API ao salvar (com opção de salvamento parcial)
- Carregamento de dados existentes para edição de planos
- Estrutura de dados expandida para acomodar componentes especializados

### 3. Integração com IA
- Funcionalidade para gerar o plano final com base nos dados coletados
- Chamada assíncrona ao serviço de IA com feedback visual do progresso
- Controle de status do plano durante o processo de geração
- Redirecionamento automático para visualização do plano finalizado
- Processamento de dados estruturados para geração de recomendações personalizadas

### 4. Navegação e Controle
- Botões para navegação entre etapas (Próximo/Voltar)
- Botão para salvar progresso a qualquer momento
- Alertas para confirmação de saída sem salvar
- Opção de saída com salvamento automático
- Feedback visual para ações em andamento

## Etapas do Formulário Integrado

1. **Dados da Paciente**: Informações básicas como nome, idade, altura, peso, contato e endereço
2. **Histórico Menstrual**: Detalhes sobre o ciclo menstrual, regularidade, TPM, menopausa e uso de contraceptivos
3. **Sintomas**: Registro de sintomas principais, priorização, classificação e histórico
4. **Histórico de Saúde**: Condições pre-existentes, medicações, alergias, histórico familiar e vacinações
5. **Estilo de Vida**: Alimentação, exercícios, sono, estresse, hobbies e fatores ambientais
6. **Resultados de Exames**: Upload, gestão e análise de exames laboratoriais
7. **Medicina Tradicional Chinesa**: Avaliação de pulso, língua, constituição e cinco elementos
8. **Matriz IFM**: Preenchimento dos 16 nós da matriz de Medicina Funcional com pontuação e observações
9. **Linha do Tempo Funcional**: Registro de eventos significativos e seu impacto na saúde
10. **Revisão Final**: Visão geral dos dados e confirmação para geração do plano

## Interatividade e Feedback

- **Animau00e7u00f5es**: Transiu00e7u00f5es suaves entre etapas com Framer Motion
- **Alertas**: Notificau00e7u00f5es para au00e7u00f5es importantes (salvar, erros, sucesso)
- **Indicadores de Progresso**: Stepper visual mostrando a posiu00e7u00e3o atual no fluxo
- **Diu00e1logos de Confirmau00e7u00e3o**: Para au00e7u00f5es cru00edticas como sau00edda sem salvar ou gerau00e7u00e3o do plano

## Integrau00e7u00e3o com Serviu00e7os

- **PlanService.getPlan**: Carrega dados de um plano existente para ediu00e7u00e3o
- **PlanService.createPlan**: Cria um novo plano no sistema
- **PlanService.updatePlan**: Atualiza um plano existente
- **PlanService.generatePlan**: Solicita a gerau00e7u00e3o do plano final via IA

## Estrutura de Dados

O componente gerencia uma estrutura complexa de dados que inclui:

```javascript
{
  title: string,
  status: 'draft' | 'in_progress' | 'completed',
  patient: { name, age, height, weight, ... },
  menstrual_history: { cycle_length, regularity, ... },
  symptoms: [ { description, priority, duration, ... } ],
  health_history: { conditions, medications, ... },
  lifestyle: { diet, exercise, sleep, ... },
  exams: [ { type, file, results, ... } ],
  tcm: { face, tongue, pulse, ... },
  ifm_matrix: { assimilation, defense, ... },
  timeline: [ { date, event, impact, ... } ],
  notes: string
}
```

## Considerau00e7u00f5es Tu00e9cnicas

- O componente utiliza hooks React (`useState`, `useEffect`, `useParams`, `useNavigate`)
- Implementa gerenciamento de estado complexo para um formulu00e1rio multi-etapas
- Incorpora gestu00e3o assu00edncrona de dados com feedback visual apropriado
- Utiliza composiu00e7u00e3o de componentes para separar a lu00f3gica de cada etapa
- Implementa navegau00e7u00e3o programática com React Router
