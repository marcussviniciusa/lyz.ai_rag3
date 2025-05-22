const { LLMChain } = require('langchain/chains');
const { PromptTemplate } = require('langchain/prompts');
const { OpenAI } = require('@langchain/openai');
const logger = require('../utils/logger');

/**
 * Serviço para integração com LangChain para processamento de linguagem natural
 * e geração de planos personalizados
 */
class LangChainService {
  constructor() {
    // Inicializar modelo LLM
    this.model = new OpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: 'gpt-4-1106-preview', // Modelo avançado para análises detalhadas
      temperature: 0.7, // Balanço entre criatividade e precisão
      maxTokens: 4000, // Limite de tokens para respostas detalhadas
    });
    
    // Inicializar templates de prompts
    this.initPromptTemplates();
  }

  /**
   * Inicializa os templates de prompts utilizados no sistema
   */
  initPromptTemplates() {
    // Template para análise de exames laboratoriais
    this.labAnalysisTemplate = PromptTemplate.fromTemplate(
      `Você é um especialista em análise de exames laboratoriais com foco na saúde feminina.
      Analise os seguintes resultados de exames e forneça uma interpretação detalhada, 
      identificando possíveis desequilíbrios e sua relação com os sintomas da paciente.
      
      Informações da paciente:
      Nome: {patientName}
      Idade: {patientAge}
      Principais sintomas: {symptoms}
      
      Resultados dos exames:
      {examResults}
      
      Forneça uma análise detalhada, destacando:
      1. Valores fora da normalidade e sua relevância clínica
      2. Possíveis correlações com os sintomas apresentados
      3. Áreas que merecem atenção especial
      4. Recomendações para exames complementares, se necessário
      
      Mantenha sua análise técnica mas compreensível para profissionais da saúde.`
    );
    
    // Template para análise de Medicina Tradicional Chinesa
    this.tcmAnalysisTemplate = PromptTemplate.fromTemplate(
      `Você é um especialista em Medicina Tradicional Chinesa com foco em saúde feminina.
      Com base nas seguintes observações, forneça uma análise detalhada da paciente 
      segundo os princípios da MTC, incluindo diagnóstico energético.
      
      Informações da paciente:
      Nome: {patientName}
      Idade: {patientAge}
      Principais sintomas: {symptoms}
      
      Observações MTC:
      Face: {face}
      Língua: {tongue}
      Pulso: {pulse}
      Sinais energéticos: {energySigns}
      
      Histórico menstrual:
      {menstrualHistory}
      
      Forneça uma análise detalhada, incluindo:
      1. Diagnóstico segundo a MTC (desequilíbrios de Qi, Sangue, Yin, Yang)
      2. Órgãos e meridianos afetados
      3. Relação com os ciclos naturais femininos
      4. Recomendações segundo a MTC (acupuntura, fitoterapia chinesa, etc.)`
    );
    
    // Template para análise da Matriz IFM
    this.ifmAnalysisTemplate = PromptTemplate.fromTemplate(
      `Você é um especialista em Medicina Funcional com foco em saúde feminina.
      Analise os dados da Matriz do Instituto de Medicina Funcional (IFM) e forneça 
      insights sobre os desequilíbrios funcionais da paciente.
      
      Informações da paciente:
      Nome: {patientName}
      Idade: {patientAge}
      Principais sintomas: {symptoms}
      
      Matriz IFM:
      Assimilação: {assimilation}
      Defesa e Reparo: {defense}
      Energia: {energy}
      Biotransformação e Eliminação: {biotransformation}
      Transporte: {transport}
      Comunicação: {communication}
      Estrutura: {structure}
      
      Forneça uma análise detalhada, destacando:
      1. Principais sistemas funcionais comprometidos
      2. Interrelações entre os diferentes sistemas
      3. Relação com os ciclos hormonais femininos
      4. Abordagem funcional recomendada`
    );
    
    // Template para plano final completo
    this.finalPlanTemplate = PromptTemplate.fromTemplate(
      `Você é um especialista em saúde integrativa feminina, com amplo conhecimento em medicina funcional, 
      medicina tradicional chinesa, e abordagens baseadas na ciclicidade feminina.
      
      Crie um plano detalhado e personalizado para a paciente com base em todas as informações fornecidas.
      
      INFORMAÇÕES DA PACIENTE:
      Nome: {patientName}
      Idade: {patientAge}
      Altura: {patientHeight}cm
      Peso: {patientWeight}kg
      
      SINTOMAS PRINCIPAIS (em ordem de prioridade):
      {symptoms}
      
      HISTÓRICO MENSTRUAL:
      {menstrualHistory}
      
      HISTÓRICO DE SAÚDE:
      {healthHistory}
      
      ESTILO DE VIDA:
      {lifestyle}
      
      ANÁLISE DE EXAMES:
      {examAnalysis}
      
      ANÁLISE MTC:
      {tcmAnalysis}
      
      ANÁLISE DA MATRIZ IFM:
      {ifmAnalysis}
      
      LINHA DO TEMPO FUNCIONAL:
      {timeline}
      
      Desenvolva um plano abrangente organizado nas seguintes seções:
      
      1. RESUMO CLÍNICO
      Um resumo conciso do caso, destacando os principais desequilíbrios identificados e como eles se relacionam com os sintomas.
      
      2. ABORDAGEM TERAPÊUTICA
      Visão geral da estratégia terapêutica personalizada, considerando a ciclicidade feminina.
      
      3. RECOMENDAÇÕES ALIMENTARES
      - Padrão alimentar geral recomendado
      - Alimentos a serem priorizados e motivos
      - Alimentos a serem evitados/reduzidos e motivos
      - Considerações sobre timing das refeições
      - Adaptações conforme as fases do ciclo (se aplicável)
      
      4. SUPLEMENTAÇÃO RECOMENDADA
      Para cada suplemento, especifique:
      - Nome
      - Dosagem
      - Frequência
      - Duração recomendada
      - Benefícios esperados
      - Considerações sobre as fases do ciclo (se aplicável)
      
      5. PRÁTICAS DE ESTILO DE VIDA
      - Recomendações para sono
      - Estratégias para gestão de estresse
      - Atividade física adequada conforme as fases do ciclo
      - Práticas de autocuidado
      - Outras recomendações relevantes
      
      6. CRONOGRAMA DE IMPLEMENTAÇÃO
      Um guia de como implementar as recomendações de forma gradual e sustentável.
      
      7. METAS E ACOMPANHAMENTO
      - Resultados esperados em curto, médio e longo prazo
      - Sugestões para acompanhamento e ajustes
      - Exames recomendados para follow-up
      
      O plano deve ser detalhado, baseado em evidências, respeitando as particularidades da paciente 
      e focado na ciclicidade feminina como fundamento para a saúde. Use uma linguagem técnica mas acessível.
      `
    );
  }

  /**
   * Prepara os dados do plano para processamento
   * @param {Object} plan - Objeto do plano
   * @returns {Object} Dados formatados para processamento
   */
  preparePlanData(plan) {
    // Formatar sintomas em lista
    const symptoms = plan.symptoms
      .sort((a, b) => a.priority - b.priority)
      .map((s, index) => `${index + 1}. ${s.description}`)
      .join('\n');
    
    // Formatar histórico menstrual
    let menstrualHistory = '';
    if (plan.menstrual_history) {
      const mh = plan.menstrual_history;
      menstrualHistory = [
        `Idade da menarca: ${mh.menarche_age || 'Não informado'}`,
        `Duração média do ciclo: ${mh.cycle_duration || 'Não informado'} dias`,
        `Duração média da menstruação: ${mh.menstruation_duration || 'Não informado'} dias`,
        `Em climatério/menopausa: ${mh.is_menopausal ? 'Sim' : 'Não'}`,
        `Data da última menstruação: ${mh.last_menstruation ? new Date(mh.last_menstruation).toLocaleDateString() : 'Não informado'}`,
        `Uso de contraceptivos: ${mh.contraceptives || 'Não informado'}`
      ].join('\n');
    }
    
    // Formatar histórico de saúde
    let healthHistory = '';
    if (plan.health_history) {
      const hh = plan.health_history;
      healthHistory = [
        `Histórico médico: ${hh.medical_history || 'Não informado'}`,
        `Histórico familiar: ${hh.family_history || 'Não informado'}`,
        `Alergias e intolerâncias: ${hh.allergies || 'Não informado'}`,
        `Tratamentos anteriores: ${hh.previous_treatments || 'Não informado'}`,
        `Medicamentos atuais: ${hh.current_medications || 'Não informado'}`,
        `Suplementos atuais: ${hh.current_supplements || 'Não informado'}`
      ].join('\n');
    }
    
    // Formatar estilo de vida
    let lifestyle = '';
    if (plan.lifestyle) {
      const ls = plan.lifestyle;
      lifestyle = [
        `Qualidade do sono: ${ls.sleep_quality || 'Não informado'}`,
        `Horas médias de sono: ${ls.sleep_hours || 'Não informado'}`,
        `Exercícios físicos: ${ls.exercise || 'Não informado'}`,
        `Nível de estresse: ${ls.stress_level || 'Não informado'}`,
        `Qualidade da alimentação: ${ls.diet_quality || 'Não informado'}`,
        `Qualidade dos relacionamentos: ${ls.relationships_quality || 'Não informado'}`,
        `Objetivos do tratamento: ${ls.treatment_goals || 'Não informado'}`
      ].join('\n');
    }
    
    // Formatar linha do tempo
    const timeline = plan.timeline && plan.timeline.length > 0
      ? plan.timeline
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map(item => `${new Date(item.date).toLocaleDateString()} - ${item.type ? `[${item.type}] ` : ''}${item.description}`)
        .join('\n')
      : 'Não informado';
    
    return {
      patientName: plan.patient.name,
      patientAge: plan.patient.age || 'Não informado',
      patientHeight: plan.patient.height || 'Não informado',
      patientWeight: plan.patient.weight || 'Não informado',
      symptoms,
      menstrualHistory,
      healthHistory,
      lifestyle,
      timeline,
      // Outros campos serão preenchidos durante o processo de análise
    };
  }

  /**
   * Analisa exames laboratoriais
   * @param {Object} planData - Dados do plano
   * @param {Array} exams - Exames a serem analisados
   * @returns {Promise<string>} Análise dos exames
   */
  async analyzeExams(planData, exams) {
    if (!exams || exams.length === 0) {
      return 'Não foram fornecidos exames para análise.';
    }
    
    try {
      // Formatar resultados dos exames
      const examResults = exams
        .map(exam => {
          return `Exame: ${exam.name || 'Não especificado'}\n` +
            `Data: ${exam.date ? new Date(exam.date).toLocaleDateString() : 'Não especificado'}\n` +
            `Resultados: ${exam.results || 'Não especificado'}\n`;
        })
        .join('\n-----------------------\n');
      
      // Criar e executar a cadeia LLM
      const chain = new LLMChain({
        llm: this.model,
        prompt: this.labAnalysisTemplate
      });
      
      const result = await chain.call({
        patientName: planData.patientName,
        patientAge: planData.patientAge,
        symptoms: planData.symptoms,
        examResults
      });
      
      return result.text;
    } catch (error) {
      logger.error('Erro ao analisar exames:', error);
      return 'Não foi possível analisar os exames devido a um erro.';
    }
  }

  /**
   * Analisa observações de Medicina Tradicional Chinesa
   * @param {Object} planData - Dados do plano
   * @param {Object} tcmObs - Observações de MTC
   * @returns {Promise<string>} Análise de MTC
   */
  async analyzeTCM(planData, tcmObs) {
    if (!tcmObs || Object.keys(tcmObs).length === 0) {
      return 'Não foram fornecidas observações de Medicina Tradicional Chinesa.';
    }
    
    try {
      const chain = new LLMChain({
        llm: this.model,
        prompt: this.tcmAnalysisTemplate
      });
      
      const result = await chain.call({
        patientName: planData.patientName,
        patientAge: planData.patientAge,
        symptoms: planData.symptoms,
        face: tcmObs.face || 'Não observado',
        tongue: tcmObs.tongue || 'Não observado',
        pulse: tcmObs.pulse || 'Não observado',
        energySigns: tcmObs.energy_signs || 'Não observado',
        menstrualHistory: planData.menstrualHistory
      });
      
      return result.text;
    } catch (error) {
      logger.error('Erro ao analisar MTC:', error);
      return 'Não foi possível analisar as observações de MTC devido a um erro.';
    }
  }

  /**
   * Analisa matriz IFM
   * @param {Object} planData - Dados do plano
   * @param {Object} ifmMatrix - Dados da matriz IFM
   * @returns {Promise<string>} Análise da matriz IFM
   */
  async analyzeIFM(planData, ifmMatrix) {
    if (!ifmMatrix || Object.keys(ifmMatrix).length === 0) {
      return 'Não foram fornecidos dados da matriz IFM.';
    }
    
    try {
      const chain = new LLMChain({
        llm: this.model,
        prompt: this.ifmAnalysisTemplate
      });
      
      const result = await chain.call({
        patientName: planData.patientName,
        patientAge: planData.patientAge,
        symptoms: planData.symptoms,
        assimilation: ifmMatrix.assimilation || 'Não informado',
        defense: ifmMatrix.defense || 'Não informado',
        energy: ifmMatrix.energy || 'Não informado',
        biotransformation: ifmMatrix.biotransformation || 'Não informado',
        transport: ifmMatrix.transport || 'Não informado',
        communication: ifmMatrix.communication || 'Não informado',
        structure: ifmMatrix.structure || 'Não informado'
      });
      
      return result.text;
    } catch (error) {
      logger.error('Erro ao analisar matriz IFM:', error);
      return 'Não foi possível analisar a matriz IFM devido a um erro.';
    }
  }

  /**
   * Gera o plano final personalizado
   * @param {Object} plan - Objeto completo do plano
   * @returns {Promise<Object>} Plano final gerado
   */
  async generatePlan(plan) {
    try {
      // Registrar início da geração
      plan.generation_started_at = new Date();
      
      // Preparar dados para processamento
      const planData = this.preparePlanData(plan);
      
      // Realizar análises específicas em paralelo
      const [examAnalysis, tcmAnalysis, ifmAnalysis] = await Promise.all([
        this.analyzeExams(planData, plan.exams),
        this.analyzeTCM(planData, plan.tcm_observations),
        this.analyzeIFM(planData, plan.ifm_matrix)
      ]);
      
      // Adicionar análises ao objeto de dados
      planData.examAnalysis = examAnalysis;
      planData.tcmAnalysis = tcmAnalysis;
      planData.ifmAnalysis = ifmAnalysis;
      
      // Gerar plano final
      const chain = new LLMChain({
        llm: this.model,
        prompt: this.finalPlanTemplate
      });
      
      const result = await chain.call(planData);
      
      // Formatar plano final
      const finalPlan = {
        content: result.text,
        // Em uma implementação completa, aqui extrairíamos as recomendações
        // específicas para categorização
        recommendations: this.extractRecommendations(result.text),
        token_usage: this.estimateTokenUsage(result.text)
      };
      
      return finalPlan;
    } catch (error) {
      logger.error('Erro ao gerar plano:', error);
      throw new Error(`Erro ao gerar plano: ${error.message}`);
    }
  }

  /**
   * Extrai recomendações específicas do plano gerado
   * @param {string} planText - Texto do plano gerado
   * @returns {Array} Lista de recomendações categorizadas
   */
  extractRecommendations(planText) {
    // Implementação simplificada - em produção usaria NLP mais avançado
    const recommendations = [];
    
    // Extrair recomendações alimentares
    const dietSection = this.extractSection(planText, '3. RECOMENDAÇÕES ALIMENTARES', '4.');
    if (dietSection) {
      recommendations.push({
        type: 'alimentação',
        description: this.summarizeSection(dietSection)
      });
    }
    
    // Extrair suplementação
    const supplementSection = this.extractSection(planText, '4. SUPLEMENTAÇÃO RECOMENDADA', '5.');
    if (supplementSection) {
      recommendations.push({
        type: 'suplementação',
        description: this.summarizeSection(supplementSection)
      });
    }
    
    // Extrair práticas de estilo de vida
    const lifestyleSection = this.extractSection(planText, '5. PRÁTICAS DE ESTILO DE VIDA', '6.');
    if (lifestyleSection) {
      recommendations.push({
        type: 'estilo de vida',
        description: this.summarizeSection(lifestyleSection)
      });
    }
    
    return recommendations;
  }

  /**
   * Extrai uma seção específica do texto
   * @param {string} text - Texto completo
   * @param {string} sectionStart - Marcador de início da seção
   * @param {string} sectionEnd - Marcador de fim da seção
   * @returns {string} Texto da seção
   */
  extractSection(text, sectionStart, sectionEnd) {
    const startIndex = text.indexOf(sectionStart);
    if (startIndex === -1) return '';
    
    const endIndex = text.indexOf(sectionEnd, startIndex + sectionStart.length);
    if (endIndex === -1) {
      return text.substring(startIndex + sectionStart.length).trim();
    }
    
    return text.substring(startIndex + sectionStart.length, endIndex).trim();
  }

  /**
   * Cria um resumo da seção para a lista de recomendações
   * @param {string} sectionText - Texto da seção
   * @returns {string} Resumo da seção
   */
  summarizeSection(sectionText) {
    // Limitar a 500 caracteres para o resumo
    if (sectionText.length <= 500) {
      return sectionText;
    }
    
    return sectionText.substring(0, 497) + '...';
  }

  /**
   * Estima o uso de tokens com base no tamanho do texto
   * @param {string} text - Texto para estimar tokens
   * @returns {number} Estimativa de tokens utilizados
   */
  estimateTokenUsage(text) {
    // Estimativa simplificada - aproximadamente 4 caracteres por token
    return Math.ceil(text.length / 4);
  }
}

// Exportar instância única do serviço
module.exports = new LangChainService();
