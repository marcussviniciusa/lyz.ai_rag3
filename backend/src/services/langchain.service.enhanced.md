# Serviço LangChain Aprimorado

## Visão Geral
O serviço LangChain Aprimorado oferece funcionalidades para processamento de dados de saúde e geração de planos personalizados utilizando modelos de linguagem avançados. Este serviço é especialmente projetado para o sistema Lyz Healthcare, integrando múltiplas fontes de dados para fornecer uma análise holística de saúde para mulheres.

## Recursos Principais

### Inicialização e Configuração
- Inicialização automatizada do modelo GPT-4 com gerenciamento de tokens e memória
- Cache de resposta para otimizar o uso da API e melhorar o tempo de resposta
- Templates de prompts estruturados para diferentes tipos de análise

### Processamento de Dados
- Preparação de dados de pacientes para análise incluindo histórico médico, sintomas e estilo de vida
- Estruturação de dados da Matriz IFM (Instituto de Medicina Funcional) com 16 nós
- Formatação de dados de Medicina Tradicional Chinesa (MTC)
- Processamento de linha do tempo funcional

### Análises Especializadas
- **Análise de Exames**: Interpretação de resultados laboratoriais em relação aos sintomas apresentados
- **Análise de Matriz IFM**: Avaliação dos processos fisiológicos, estilo de vida e fatores mediadores
- **Análise de MTC**: Interpretação de diagnósticos de pulso, língua e equilíbrio dos cinco elementos
- **Análise de Linha do Tempo Funcional**: Compreensão da progressão temporal dos sintomas e eventos de saúde

### Geração de Plano
- Integração de todas as análises para criar um plano de saúde abrangente
- Estruturação de recomendações por categorias (nutrição, suplementação, exercícios, etc.)
- Extração inteligente de seções específicas do plano gerado

## Métodos

### `preparePlanData(plan)`
Prepara e estrutura os dados do paciente para processamento pelo modelo de linguagem, aplicando otimização de tokens para reduzir o consumo da API.

**Parâmetros:**
- `plan` (Objeto): Dados completos do plano de saúde incluindo informações do paciente, sintomas, histórico, etc.

**Processamento:**
- Estrutura dados do paciente, sintomas, histórico menstrual, e linha do tempo
- Processa informações da matriz IFM (16 nós) e Medicina Tradicional Chinesa
- Aplica o serviço de otimização de tokens para reduzir o tamanho dos dados
- Registra o processo através de logs para monitoria

**Retorno:**
- Objeto otimizado contendo todos os dados necessários para análise, com uso eficiente de tokens

### `analyzeExams(planData, exams)`
Analisa resultados de exames laboratoriais em relação aos sintomas e histórico do paciente.

**Parâmetros:**
- `planData` (Objeto): Dados formatados do plano
- `exams` (Array): Lista de exames com resultados

**Retorno:**
- String contendo análise detalhada dos exames

### `analyzeTimeline(planData, timeline)`
Analisa a linha do tempo funcional para identificar padrões e relações causais entre eventos de saúde.

**Parâmetros:**
- `planData` (Objeto): Dados formatados do plano
- `timeline` (Array): Eventos da linha do tempo funcional

**Retorno:**
- String contendo análise da linha do tempo

### `analyzeIFM(planData)`
Analisa a matriz IFM expandida com 16 nós para identificar desequilíbrios e áreas que necessitam de intervenção.

**Parâmetros:**
- `planData` (Objeto): Dados formatados do plano contendo os scores e notas da matriz IFM

**Retorno:**
- String contendo análise da matriz IFM

### `analyzeTCM(planData)`
Analisa observações de Medicina Tradicional Chinesa para fornecer insights sobre o equilíbrio energético.

**Parâmetros:**
- `planData` (Objeto): Dados formatados do plano contendo observações de MTC

**Retorno:**
- String contendo análise de MTC

### `generatePlan(plan)`
Gera o plano de saúde personalizado completo integrando todas as análises.

**Parâmetros:**
- `plan` (Objeto): Dados completos do plano de saúde

**Retorno:**
- Objeto contendo o plano de saúde gerado com todas as recomendações estruturadas

### `extractSection(text, sectionName)`
Extrai uma seção específica do texto do plano gerado.

**Parâmetros:**
- `text` (String): Texto completo do plano
- `sectionName` (String): Nome da seção a ser extraída

**Retorno:**
- String contendo o conteúdo da seção especificada

## Exemplo de Uso

```javascript
// Inicializar o serviço
const langchainService = new LangChainServiceEnhanced();

// Gerar um plano completo
async function generateHealthPlan(planData) {
  try {
    const generatedPlan = await langchainService.generatePlan(planData);
    return generatedPlan;
  } catch (error) {
    console.error('Erro ao gerar plano:', error);
    throw error;
  }
}
```

## Considerações Técnicas

### Otimização de Desempenho
- Utiliza cache para reduzir chamadas repetidas à API do OpenAI
- Execução paralela de análises independentes para melhorar o tempo de resposta
- Estruturação cuidadosa de prompts para reduzir o uso de tokens
- **Sistema de Cache Avançado**: Implementação completa de cache em múltiplos níveis
  - Cache em memória para respostas frequentes
  - Persistência de dados cruciais para uso entre reinícios do servidor
  - Categorização e TTL (Time-To-Live) configurados por tipo de dado
  - Invalidação de cache inteligente baseada em modificações de dados

- **Otimização de Tokens**: Sistema avançado para monitoramento e redução do consumo de tokens
  - Monitoramento em tempo real de uso de tokens por categoria de operação
  - Estratégias de compressão semântica para reduzir tokens sem perder informação essencial
  - Priorização inteligente de conteúdo para otimizar requisições à API
  - Mecanismo de retry com backoff exponencial para falhas de API

### Tratamento de Erros
- Captura e registro detalhado de erros em cada etapa do processo
- Retorno de mensagens informativas quando análises específicas não podem ser realizadas
- Preservação dos dados originais para referência

### Expansibilidade
- Arquitetura modular que permite a fácil adição de novos tipos de análises
- Capacidade de integrar novos modelos de linguagem conforme disponíveis
- Flexibilidade para personalizar prompts e templates de acordo com necessidades específicas
