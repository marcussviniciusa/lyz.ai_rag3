# Integração LangChain no Sistema Lyz

## Visão Geral

Este documento detalha a implementação da integração com LangChain para processamento de dados e geração de planos de saúde personalizados no sistema Lyz. A integração utiliza modelos avançados da OpenAI para analisar informações coletadas durante o processo de consulta e gerar recomendações personalizadas baseadas na ciclicidade feminina.

## Arquitetura da Integração

### 1. Fluxo de Processamento

```
[Dados do Formulário] -> [Preprocessamento] -> [Análises Específicas] -> [Geração do Plano] -> [Extração de Recomendações] -> [Plano Final]
```

### 2. Componentes Principais

- **LangChainService**: Serviço central que coordena todo o processamento
- **Prompt Templates**: Templates especializados para cada tipo de análise
- **Chains**: Cadeias de processamento para análises específicas
- **Modelo LLM**: Interface com a API da OpenAI (GPT-4)
- **Extratores**: Processadores para identificar recomendações específicas

## Implementação Técnica

### 1. Inicialização do Serviço

O serviço é inicializado com um modelo GPT-4 configurado para balancear criatividade e precisão, com limites adequados de tokens para permitir respostas detalhadas.

### 2. Templates de Prompts

Templates especializados são criados para cada tipo de análise:

- **Análise de Exames**: Interpretação de resultados laboratoriais
- **Análise MTC**: Avaliação segundo a Medicina Tradicional Chinesa
- **Análise IFM**: Interpretação da Matriz do Instituto de Medicina Funcional
- **Análise da Linha do Tempo**: Correlação de eventos com sintomas
- **Plano Final**: Geração do plano terapêutico completo

### 3. Preprocessamento de Dados

O método `preparePlanData` organiza e formata os dados coletados no formulário para serem processados pelos modelos de IA, incluindo:

- Dados da paciente
- Sintomas priorizados
- Histórico menstrual e de saúde
- Estilo de vida
- Resultados de exames
- Observações de MTC
- Matriz IFM
- Linha do tempo funcional

### 4. Análises Específicas

Cada componente do plano é analisado separadamente:

- **analyzeExams**: Processamento e interpretação de exames laboratoriais
- **analyzeTCM**: Análise de dados da Medicina Tradicional Chinesa
- **analyzeIFM**: Interpretação da Matriz IFM com 16 nós
- **analyzeTimeline**: Análise da linha do tempo e correlações

### 5. Geração do Plano Final

O método `generatePlan` integra todas as análises em um plano personalizado, considerando:

- Inter-relações entre sistemas
- Ciclicidade feminina
- Abordagem funcional personalizada
- Intervenções escalonadas

### 6. Extração de Recomendações

O método `extractRecommendations` identifica e categoriza recomendações específicas do plano para facilitar a implementação pela paciente.

## Prompts Especializados

O sistema utiliza prompts cuidadosamente desenvolvidos para obter resultados precisos e personalizados. Exemplos:

### Análise IFM

```
Você é um especialista em Medicina Funcional com foco em saúde feminina.
Analise os dados da Matriz do Instituto de Medicina Funcional (IFM) com seus 16 nós e forneça insights sobre os desequilíbrios funcionais da paciente...
```

### Análise MTC

```
Você é um especialista em Medicina Tradicional Chinesa com foco em saúde feminina.
Com base nas observações de língua, pulso, e manifestações energéticas, forneça uma análise detalhada da paciente segundo os princípios da MTC...
```

## Melhorias na Implementação

### 1. Aprimoramentos na Estrutura de Dados

O serviço foi adaptado para processar a estrutura de dados aprimorada que implementamos nos componentes frontend:

- **Matriz IFM com 16 nós**: Processamento dos dados de pontuação e observações de cada nó
- **Linha do Tempo Funcional**: Análise cronológica dos eventos e seu impacto
- **Resultados de Exames**: Interpretação de exames com upload de arquivos
- **MTC Expandida**: Processamento de dados detalhados sobre diagnóstico chinês

### 2. Otimização de Tokens

Implementação de estratégias para otimizar o uso de tokens:

- Priorização de dados relevantes
- Resumo inteligente de informações extensas
- Processamento em paralelo para análises específicas
- Cache de resultados para consultas frequentes

### 3. Feedback Visual

O frontend foi integrado para mostrar o progresso do processamento:

- Indicadores de etapas concluídas
- Estimativa de tempo restante
- Alertas para possíveis atrasos
- Fallback para problemas na API

## Considerações de Implementação

### 1. Segurança e Privacidade

- Minimização de dados pessoais nos prompts
- Retenção limitada de dados processados
- Logging controlado para depuração

### 2. Escalabilidade

- Processamento assíncrono para planos extensos
- Filas para gerenciar picos de demanda
- Limites configuráveis por empresa/usuário

### 3. Monitoramento

- Rastreamento de uso de tokens
- Métricas de tempo de processamento
- Análise de qualidade das respostas

## Próximos Passos

1. **Refinamento de Prompts**: Ajuste contínuo dos prompts para resultados mais precisos
2. **Modelo Fine-tuned**: Desenvolvimento de modelos específicos para saúde feminina
3. **Análise Semântica**: Implementação de análise semântica avançada para extração de recomendações
4. **Feedback Loop**: Integração de feedback da usuária para melhorar recomendações futuras
