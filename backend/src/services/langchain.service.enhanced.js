const { LLMChain } = require('langchain/chains');
const { PromptTemplate } = require('langchain/prompts');
const { OpenAI } = require('langchain/llms/openai');
const crypto = require('crypto');
const logger = require('../config/logger');
const tokenOptimizationService = require('./token.optimization.service');
const cacheService = require('./cache.service');

/**
 * Serviu00e7o aprimorado para integrau00e7u00e3o com LangChain para processamento 
 * de linguagem natural e gerau00e7u00e3o de planos personalizados
 */
class LangChainEnhancedService {
  constructor() {
    // Inicializar modelo LLM
    this.model = new OpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: 'gpt-4-turbo-preview', // Modelo mais recente para melhor desempenho
      temperature: 0.7, // Balanu00e7o entre criatividade e precisu00e3o
      maxTokens: 4000, // Limite de tokens para respostas detalhadas
    });
    
    // Inicializar templates de prompts
    this.initPromptTemplates();
    
    // Cache já inicializado pelo serviço de cache
    logger.info('LangChainEnhancedService inicializado com cache avançado');
  }
  
  /**
   * Gera um hash para identificação única de conteúdo
   * @param {any} content - Conteúdo para gerar o hash
   * @returns {string} Hash gerado
   * @private
   */
  _generateContentHash(content) {
    const data = typeof content === 'string' ? content : JSON.stringify(content);
    return crypto.createHash('md5').update(data).digest('hex').substring(0, 10);
  }

  /**
   * Inicializa os templates de prompts utilizados no sistema
   */
  initPromptTemplates() {
    // Template para anu00e1lise de exames laboratoriais
    this.labAnalysisTemplate = PromptTemplate.fromTemplate(
      `Vocu00ea u00e9 um especialista em anu00e1lise de exames laboratoriais com foco na sau00fade feminina.
      Analise os seguintes resultados de exames e forneu00e7a uma interpretau00e7u00e3o detalhada, 
      identificando possu00edveis desequilu00edbrios e sua relau00e7u00e3o com os sintomas da paciente.
      
      Informau00e7u00f5es da paciente:
      Nome: {patientName}
      Idade: {patientAge}
      Principais sintomas: {symptoms}
      
      Resultados dos exames:
      {examResults}
      
      Forneu00e7a uma anu00e1lise detalhada, destacando:
      1. Valores fora da normalidade e sua relevu00e2ncia clu00ednica
      2. Possu00edveis correlau00e7u00f5es com os sintomas apresentados
      3. u00c1reas que merecem atenu00e7u00e3o especial
      4. Recomendau00e7u00f5es para exames complementares, se necessu00e1rio
      5. Considerau00e7u00f5es sobre a ciclicidade feminina
      
      Mantenha sua anu00e1lise tu00e9cnica mas compreensu00edvel para profissionais da sau00fade.`
    );
    
    // Template para anu00e1lise de Medicina Tradicional Chinesa
    this.tcmAnalysisTemplate = PromptTemplate.fromTemplate(
      `Vocu00ea u00e9 um especialista em Medicina Tradicional Chinesa com foco em sau00fade feminina.
      Com base nas seguintes observau00e7u00f5es, forneu00e7a uma anu00e1lise detalhada da paciente 
      segundo os princu00edpios da MTC, incluindo diagnu00f3stico energu00e9tico.
      
      Informau00e7u00f5es da paciente:
      Nome: {patientName}
      Idade: {patientAge}
      Principais sintomas: {symptoms}
      
      Observau00e7u00f5es MTC:
      Constituiu00e7u00e3o: {constitution}
      
      Diagnu00f3stico de pulso:
      Ritmo: {pulseRhythm}
      Foru00e7a: {pulseStrength}
      Qualidade: {pulseQuality}
      
      Diagnu00f3stico de lu00edngua:
      Cor: {tongueColor}
      Revestimento: {tongueCoating}
      Forma: {tongueShape}
      Umidade: {tongueMoisture}
      
      Cinco elementos:
      Madeira: {elementWood}
      Fogo: {elementFire}
      Terra: {elementEarth}
      Metal: {elementMetal}
      u00c1gua: {elementWater}
      
      Equilu00edbrio Yin-Yang: {yinYangBalance}
      
      Histu00f3rico menstrual:
      {menstrualHistory}
      
      Forneu00e7a uma anu00e1lise detalhada, incluindo:
      1. Diagnu00f3stico segundo a MTC (desequilu00edbrios de Qi, Sangue, Yin, Yang)
      2. u00d3rgu00e3os e meridianos afetados
      3. Relau00e7u00e3o com os ciclos naturais femininos
      4. Recomendau00e7u00f5es segundo a MTC (acupuntura, fitoterapia chinesa, etc.)`
    );
    
    // Template para anu00e1lise da Matriz IFM
    this.ifmAnalysisTemplate = PromptTemplate.fromTemplate(
      `Vocu00ea u00e9 um especialista em Medicina Funcional com foco em sau00fade feminina.
      Analise os dados da Matriz do Instituto de Medicina Funcional (IFM) e forneu00e7a 
      insights sobre os desequilu00edbrios funcionais da paciente.
      
      Informau00e7u00f5es da paciente:
      Nome: {patientName}
      Idade: {patientAge}
      Principais sintomas: {symptoms}
      
      Matriz IFM (pontuau00e7u00e3o de 0-10 e observau00e7u00f5es):
      
      - Nu00f3s de Processamento Fisiolu00f3gico:
      Assimilau00e7u00e3o (digestu00e3o, absoru00e7u00e3o): Pontuau00e7u00e3o {assimilationScore}, {assimilationNotes}
      Defesa e Reparo (sistema imune): Pontuau00e7u00e3o {defenseScore}, {defenseNotes}
      Energia (produu00e7u00e3o mitocondrial): Pontuau00e7u00e3o {energyScore}, {energyNotes}
      Biotransformau00e7u00e3o (detoxificau00e7u00e3o): Pontuau00e7u00e3o {biotransformationScore}, {biotransformationNotes}
      Transporte (cardiovascular, linfu00e1tico): Pontuau00e7u00e3o {transportScore}, {transportNotes}
      Comunicau00e7u00e3o (hormu00f4nios, neurotransmissores): Pontuau00e7u00e3o {communicationScore}, {communicationNotes}
      Integridade Estrutural (mu00fasculo-esquelu00e9tico): Pontuau00e7u00e3o {structuralScore}, {structuralNotes}
      
      - Nu00f3s de Estilo de Vida e Ambiente:
      Mental-Emocional (estresse, resiliu00eancia): Pontuau00e7u00e3o {mentalScore}, {mentalNotes}
      Nutriu00e7u00e3o (padru00f5es alimentares): Pontuau00e7u00e3o {nutritionScore}, {nutritionNotes}
      Movimento (atividade fu00edsica): Pontuau00e7u00e3o {movementScore}, {movementNotes}
      Sono e Relaxamento: Pontuau00e7u00e3o {sleepScore}, {sleepNotes}
      Relacionamentos (conexu00f5es sociais): Pontuau00e7u00e3o {relationshipsScore}, {relationshipsNotes}
      Exposoma (fatores ambientais): Pontuau00e7u00e3o {exposomeScore}, {exposomeNotes}
      Espiritualidade (propu00f3sito, significado): Pontuau00e7u00e3o {spiritualScore}, {spiritualNotes}
      
      - Nu00f3s de Processos Mediadores:
      Inflamau00e7u00e3o: Pontuau00e7u00e3o {inflammationScore}, {inflammationNotes}
      Infecu00e7u00e3o e Disbiose: Pontuau00e7u00e3o {infectionScore}, {infectionNotes}
      
      Forneu00e7a uma anu00e1lise detalhada, destacando:
      1. Principais sistemas funcionais comprometidos (nu00f3s com pontuau00e7u00e3o acima de 5)
      2. Interrelau00e7u00f5es entre os diferentes nu00f3s da matriz
      3. Relau00e7u00e3o com os ciclos hormonais femininos
      4. Abordagem funcional recomendada para os desequilu00edbrios identificados
      5. Priorizau00e7u00e3o das intervenu00e7u00f5es sugeridas`
    );
    
    // Template para anu00e1lise da Linha do Tempo Funcional
    this.timelineAnalysisTemplate = PromptTemplate.fromTemplate(
      `Vocu00ea u00e9 um especialista em medicina funcional e anu00e1lise cronolu00f3gica de sau00fade.
      Analise a seguinte linha do tempo funcional da paciente e identifique padru00f5es, 
      gatilhos e correlau00e7u00f5es com os sintomas atuais.
      
      Informau00e7u00f5es da paciente:
      Nome: {patientName}
      Idade: {patientAge}
      Principais sintomas: {symptoms}
      
      Linha do Tempo Funcional (em ordem cronolu00f3gica):
      {timeline}
      
      Forneu00e7a uma anu00e1lise detalhada, destacando:
      1. Eventos significativos que podem ter impactado a sau00fade da paciente
      2. Possu00edveis gatilhos para os sintomas atuais
      3. Padru00f5es temporais observados
      4. Correlau00e7u00f5es entre eventos e manifestau00e7u00f5es clu00ednicas
      5. Considerau00e7u00f5es sobre peru00edodos de agravamento ou melhora
      6. Impacto dos eventos no sistema hormonal feminino`
    );
    
    // Template para plano final completo
    this.finalPlanTemplate = PromptTemplate.fromTemplate(
      `Vocu00ea u00e9 um especialista em sau00fade integrativa feminina, com amplo conhecimento em medicina funcional, 
      medicina tradicional chinesa, e abordagens baseadas na ciclicidade feminina.
      
      Crie um plano detalhado e personalizado para a paciente com base em todas as informau00e7u00f5es fornecidas.
      
      INFORMAu00c7u00d5ES DA PACIENTE:
      Nome: {patientName}
      Idade: {patientAge}
      Altura: {patientHeight}cm
      Peso: {patientWeight}kg
      
      SINTOMAS PRINCIPAIS (em ordem de prioridade):
      {symptoms}
      
      HISTu00d3RICO MENSTRUAL:
      {menstrualHistory}
      
      HISTu00d3RICO DE SAu00daDE:
      {healthHistory}
      
      ESTILO DE VIDA:
      {lifestyle}
      
      ANu00c1LISE DE EXAMES:
      {examAnalysis}
      
      ANu00c1LISE MTC:
      {tcmAnalysis}
      
      ANu00c1LISE DA MATRIZ IFM:
      {ifmAnalysis}
      
      ANu00c1LISE DA LINHA DO TEMPO FUNCIONAL:
      {timelineAnalysis}
      
      Desenvolva um plano abrangente organizado nas seguintes seu00e7u00f5es:
      
      1. RESUMO CLu00cdNICO
      Um resumo conciso do caso, destacando os principais desequilu00edbrios identificados e como eles se relacionam com os sintomas.
      
      2. ABORDAGEM TERAPu00caUTICA
      Visu00e3o geral da estratu00e9gia terapu00eautica personalizada, considerando a ciclicidade feminina.
      
      3. RECOMENDAu00c7u00d5ES ALIMENTARES
      - Padru00e3o alimentar geral recomendado
      - Alimentos a serem priorizados e motivos
      - Alimentos a serem evitados/reduzidos e motivos
      - Considerau00e7u00f5es sobre timing das refeiu00e7u00f5es
      - Adaptau00e7u00f5es conforme as fases do ciclo (se aplicu00e1vel)
      
      4. SUPLEMENTAu00c7u00c3O RECOMENDADA
      Para cada suplemento, especifique:
      - Nome
      - Dosagem
      - Frequu00eancia
      - Durau00e7u00e3o recomendada
      - Benefu00edcios esperados
      - Considerau00e7u00f5es sobre as fases do ciclo (se aplicu00e1vel)
      
      5. PRu00c1TICAS DE ESTILO DE VIDA
      - Recomendau00e7u00f5es para sono
      - Estratu00e9gias para gestu00e3o de estresse
      - Atividade fu00edsica adequada conforme as fases do ciclo
      - Pru00e1ticas de autocuidado
      - Outras recomendau00e7u00f5es relevantes
      
      6. CRONOGRAMA DE IMPLEMENTAu00c7u00c3O
      Um guia de como implementar as recomendau00e7u00f5es de forma gradual e sustentu00e1vel.
      
      7. METAS E ACOMPANHAMENTO
      - Resultados esperados em curto, mu00e9dio e longo prazo
      - Sugestu00f5es para acompanhamento e ajustes
      - Exames recomendados para follow-up
      
      O plano deve ser detalhado, baseado em evidu00eancias, respeitando as particularidades da paciente 
      e focado na ciclicidade feminina como fundamento para a sau00fade. Use uma linguagem tu00e9cnica mas acessu00edvel.
      `
    );
  }

  /**
   * Prepara os dados do plano para análise, formatando-os conforme necessário
   * e aplicando otimização de tokens para reduzir o consumo da API
   * @param {Object} plan - Objeto do plano completo
   * @returns {Object} Dados formatados para análise
   */
  async preparePlanData(plan) {
    logger.info('Preparando dados do plano para paciente:', plan.patient?.name);
    
    // Estruturar sintomas
    const symptoms = plan.symptoms && plan.symptoms.length 
      ? plan.symptoms.map(s => `${s.description} (Intensidade: ${s.intensity}/10, Frequência: ${s.frequency})`).join('\n')
      : 'Não foram informados sintomas';

    // Estruturar histórico menstrual
    const menstrualHistory = plan.menstrual_history || 'Não informado';
    
    // Estruturar histórico de saúde
    const healthHistory = plan.health_history || 'Não informado';
    
    // Estruturar estilo de vida
    const lifestyle = plan.lifestyle || 'Não informado';
    
    // Estruturar linha do tempo
    const timeline = plan.timeline && plan.timeline.length
      ? plan.timeline.map(event => 
          `${event.date || 'Data não informada'}: ${event.description} ${event.impact ? `(Impacto: ${event.impact})` : ''}`
        ).join('\n')
      : 'Não foram informados eventos na linha do tempo';
    
    // Processar dados da matriz IFM
    const ifmMatrixData = {};
    if (plan.ifm_matrix && plan.ifm_matrix.nodes) {
      const nodes = plan.ifm_matrix.nodes;
      
      // Processar cada nó da matriz IFM
      // Nós de Processamento Fisiológico
      ifmMatrixData.assimilationScore = nodes.assimilation ? nodes.assimilation.score : 0;
      ifmMatrixData.assimilationNotes = nodes.assimilation ? nodes.assimilation.notes : 'Não avaliado';
      
      ifmMatrixData.defenseScore = nodes.defense ? nodes.defense.score : 0;
      ifmMatrixData.defenseNotes = nodes.defense ? nodes.defense.notes : 'Não avaliado';
      
      ifmMatrixData.energyScore = nodes.energy ? nodes.energy.score : 0;
      ifmMatrixData.energyNotes = nodes.energy ? nodes.energy.notes : 'Não avaliado';
      
      ifmMatrixData.biotransformationScore = nodes.biotransformation ? nodes.biotransformation.score : 0;
      ifmMatrixData.biotransformationNotes = nodes.biotransformation ? nodes.biotransformation.notes : 'Não avaliado';
      
      ifmMatrixData.transportScore = nodes.transport ? nodes.transport.score : 0;
      ifmMatrixData.transportNotes = nodes.transport ? nodes.transport.notes : 'Não avaliado';
      
      ifmMatrixData.communicationScore = nodes.communication ? nodes.communication.score : 0;
      ifmMatrixData.communicationNotes = nodes.communication ? nodes.communication.notes : 'Não avaliado';
      
      ifmMatrixData.structuralScore = nodes.structural_integrity ? nodes.structural_integrity.score : 0;
      ifmMatrixData.structuralNotes = nodes.structural_integrity ? nodes.structural_integrity.notes : 'Não avaliado';
      
      // Nós de Estilo de Vida e Ambiente
      ifmMatrixData.mentalScore = nodes.mental_emotional ? nodes.mental_emotional.score : 0;
      ifmMatrixData.mentalNotes = nodes.mental_emotional ? nodes.mental_emotional.notes : 'Não avaliado';
      
      ifmMatrixData.nutritionScore = nodes.nutrition ? nodes.nutrition.score : 0;
      ifmMatrixData.nutritionNotes = nodes.nutrition ? nodes.nutrition.notes : 'Não avaliado';
      
      ifmMatrixData.movementScore = nodes.movement ? nodes.movement.score : 0;
      ifmMatrixData.movementNotes = nodes.movement ? nodes.movement.notes : 'Não avaliado';
      
      ifmMatrixData.sleepScore = nodes.sleep_relaxation ? nodes.sleep_relaxation.score : 0;
      ifmMatrixData.sleepNotes = nodes.sleep_relaxation ? nodes.sleep_relaxation.notes : 'Não avaliado';
      
      ifmMatrixData.relationshipsScore = nodes.relationships ? nodes.relationships.score : 0;
      ifmMatrixData.relationshipsNotes = nodes.relationships ? nodes.relationships.notes : 'Não avaliado';
      
      ifmMatrixData.exposomeScore = nodes.exposome ? nodes.exposome.score : 0;
      ifmMatrixData.exposomeNotes = nodes.exposome ? nodes.exposome.notes : 'Não avaliado';
      
      ifmMatrixData.spiritualScore = nodes.spiritual ? nodes.spiritual.score : 0;
      ifmMatrixData.spiritualNotes = nodes.spiritual ? nodes.spiritual.notes : 'Não avaliado';
      
      // Nós de Processos Mediadores
      ifmMatrixData.inflammationScore = nodes.inflammation ? nodes.inflammation.score : 0;
      ifmMatrixData.inflammationNotes = nodes.inflammation ? nodes.inflammation.notes : 'Não avaliado';
      
      ifmMatrixData.infectionScore = nodes.infection ? nodes.infection.score : 0;
      ifmMatrixData.infectionNotes = nodes.infection ? nodes.infection.notes : 'Não avaliado';
    }
    
    // Processar dados de Medicina Tradicional Chinesa (MTC)
    const tcmData = {};
    if (plan.traditional_chinese_medicine) {
      const tcm = plan.traditional_chinese_medicine;
      
      // Dados básicos
      tcmData.constitution = tcm.constitution || 'Não avaliado';
      tcmData.yinYangBalance = tcm.yin_yang_balance || 'Não avaliado';
      
      // Diagnóstico de pulso
      if (tcm.pulse_diagnosis) {
        tcmData.pulseRhythm = tcm.pulse_diagnosis.rhythm || 'Não avaliado';
        tcmData.pulseStrength = tcm.pulse_diagnosis.strength || 'Não avaliado';
        tcmData.pulseQuality = tcm.pulse_diagnosis.quality || 'Não avaliado';
        tcmData.pulseRate = tcm.pulse_diagnosis.rate || 'Não avaliado';
      } else {
        tcmData.pulseRhythm = tcmData.pulseStrength = tcmData.pulseQuality = tcmData.pulseRate = 'Não avaliado';
      }
      
      // Diagnóstico de língua
      if (tcm.tongue_diagnosis) {
        tcmData.tongueColor = tcm.tongue_diagnosis.color || 'Não avaliado';
        tcmData.tongueCoating = tcm.tongue_diagnosis.coating || 'Não avaliado';
        tcmData.tongueShape = tcm.tongue_diagnosis.shape || 'Não avaliado';
        tcmData.tongueMoisture = tcm.tongue_diagnosis.moisture || 'Não avaliado';
      } else {
        tcmData.tongueColor = tcmData.tongueCoating = tcmData.tongueShape = tcmData.tongueMoisture = 'Não avaliado';
      }
      
      // Cinco elementos
      if (tcm.five_elements) {
        tcmData.elementWood = tcm.five_elements.wood || 'Não avaliado';
        tcmData.elementFire = tcm.five_elements.fire || 'Não avaliado';
        tcmData.elementEarth = tcm.five_elements.earth || 'Não avaliado';
        tcmData.elementMetal = tcm.five_elements.metal || 'Não avaliado';
        tcmData.elementWater = tcm.five_elements.water || 'Não avaliado';
      } else {
        tcmData.elementWood = tcmData.elementFire = tcmData.elementEarth = tcmData.elementMetal = tcmData.elementWater = 'Não avaliado';
      }
      
      // Análise de meridianos e diagnóstico de padrão
      tcmData.meridianAnalysis = tcm.meridian_analysis && tcm.meridian_analysis.length 
        ? tcm.meridian_analysis.join(', ') 
        : 'Não avaliado';
      
      tcmData.patternDiagnosis = tcm.pattern_diagnosis && tcm.pattern_diagnosis.length 
        ? tcm.pattern_diagnosis.join(', ') 
        : 'Não avaliado';
      
      // Notas adicionais
      tcmData.notes = tcm.notes || '';
    } else {
      // Valores padrão se MTC não foi avaliada
      tcmData.constitution = tcmData.yinYangBalance = 
      tcmData.pulseRhythm = tcmData.pulseStrength = tcmData.pulseQuality = tcmData.pulseRate = 
      tcmData.tongueColor = tcmData.tongueCoating = tcmData.tongueShape = tcmData.tongueMoisture = 
      tcmData.elementWood = tcmData.elementFire = tcmData.elementEarth = tcmData.elementMetal = tcmData.elementWater = 
      tcmData.meridianAnalysis = tcmData.patternDiagnosis = 'Não avaliado';
      tcmData.notes = '';
    }
    
    // Criar objeto com todos os dados formatados
    const formattedData = {
      patientName: plan.patient.name,
      patientAge: plan.patient.age || 'Não informado',
      patientHeight: plan.patient.height || 'Não informado',
      patientWeight: plan.patient.weight || 'Não informado',
      symptoms,
      menstrualHistory,
      healthHistory,
      lifestyle,
      timeline,
      ...ifmMatrixData,
      ...tcmData,
      // Campos que serão preenchidos durante o processo de análise
      examAnalysis: '',
      tcmAnalysis: '',
      ifmAnalysis: '',
      timelineAnalysis: ''
    };
    
    // Aplicar otimização de tokens antes de retornar
    logger.info('Aplicando otimização de tokens para reduzir consumo da API');
    const optimizedData = tokenOptimizationService.optimizePlanData(formattedData);
    
    logger.info('Otimização de tokens concluída');
    return optimizedData;
  }
  
  /**
   * Analisa a linha do tempo funcional
   * @param {Object} planData - Dados do plano
   * @param {Array} timeline - Eventos da linha do tempo
   * @returns {Promise<string>} Análise da linha do tempo
   */
  async analyzeTimeline(planData, timeline) {
    if (!timeline || timeline.length === 0) {
      return 'Não foram fornecidos eventos na linha do tempo funcional.';
    }
    
    try {
      // Gerar hash do conteúdo para criação de chave de cache mais precisa
      const timelineHash = this._generateContentHash(timeline);
      const cacheKey = `timeline_${planData.patientName}_${timelineHash}`;
      
      // Verificar cache primeiro
      const cachedResult = cacheService.get(cacheKey);
      if (cachedResult) {
        logger.info('Usando cache para análise da linha do tempo');
        return cachedResult;
      }
      
      // Criar e executar a cadeia LLM
      const chain = new LLMChain({
        llm: this.model,
        prompt: this.timelineAnalysisTemplate
      });
      
      const result = await chain.call({
        patientName: planData.patientName,
        patientAge: planData.patientAge,
        symptoms: planData.symptoms,
        timeline: planData.timeline
      });
      
      // Otimização de tokens para análise da linha do tempo
      const optimizedResult = await tokenOptimizationService.optimizeTokenUsage(
        result.text,
        'timeline_analysis'
      );
      
      // Armazenar no cache avançado com categorização e persistência
      cacheService.set(cacheKey, optimizedResult, {
        category: 'timeline_analysis',
        ttl: 30 * 24 * 60 * 60 * 1000, // 30 dias
        persist: true
      });
      
      return optimizedResult;
    } catch (error) {
      logger.error('Erro ao analisar linha do tempo:', error);
      return 'Não foi possível analisar a linha do tempo devido a um erro.';
    }
  }
  
  /**
   * Analisa matriz IFM expandida com 16 nós
   * @param {Object} planData - Dados do plano
   * @returns {Promise<string>} Análise da matriz IFM
   */
  async analyzeIFM(planData) {
    // Verificar se há dados significativos na matriz IFM
    const hasSignificantData = Object.keys(planData)
      .filter(key => key.endsWith('Score'))
      .some(key => planData[key] > 0);
    
    if (!hasSignificantData) {
      return 'Não foram fornecidos dados significativos na matriz IFM.';
    }
    
    try {
      // Gerar hash dos scores para identificação única
      const ifmScores = Object.keys(planData)
        .filter(key => key.endsWith('Score'))
        .reduce((obj, key) => {
          obj[key] = planData[key];
          return obj;
        }, {});
        
      const ifmHash = this._generateContentHash(ifmScores);
      const cacheKey = `ifm_${planData.patientName}_${ifmHash}`;
      
      // Verificar cache avançado
      const cachedResult = cacheService.get(cacheKey);
      if (cachedResult) {
        logger.info('Usando cache para análise da matriz IFM');
        return cachedResult;
      }
      
      // Criar e executar a cadeia LLM
      const chain = new LLMChain({
        llm: this.model,
        prompt: this.ifmAnalysisTemplate
      });
      
      // Passar todos os dados necessários para o prompt
      const result = await chain.call({
        patientName: planData.patientName,
        patientAge: planData.patientAge,
        symptoms: planData.symptoms,
        
        // Nós de Processamento Fisiológico
        assimilationScore: planData.assimilationScore,
        assimilationNotes: planData.assimilationNotes,
        defenseScore: planData.defenseScore,
        defenseNotes: planData.defenseNotes,
        energyScore: planData.energyScore,
        energyNotes: planData.energyNotes,
        biotransformationScore: planData.biotransformationScore,
        biotransformationNotes: planData.biotransformationNotes,
        transportScore: planData.transportScore,
        transportNotes: planData.transportNotes,
        communicationScore: planData.communicationScore,
        communicationNotes: planData.communicationNotes,
        structuralScore: planData.structuralScore,
        structuralNotes: planData.structuralNotes,
        
        // Nós de Estilo de Vida e Ambiente
        mentalScore: planData.mentalScore,
        mentalNotes: planData.mentalNotes,
        nutritionScore: planData.nutritionScore,
        nutritionNotes: planData.nutritionNotes,
        movementScore: planData.movementScore,
        movementNotes: planData.movementNotes,
        sleepScore: planData.sleepScore,
        sleepNotes: planData.sleepNotes,
        relationshipsScore: planData.relationshipsScore,
        relationshipsNotes: planData.relationshipsNotes,
        exposomeScore: planData.exposomeScore,
        exposomeNotes: planData.exposomeNotes,
        spiritualScore: planData.spiritualScore,
        spiritualNotes: planData.spiritualNotes,
        
        // Nós de Processos Mediadores
        inflammationScore: planData.inflammationScore,
        inflammationNotes: planData.inflammationNotes,
        infectionScore: planData.infectionScore,
        infectionNotes: planData.infectionNotes
      });
      
      // Otimização de tokens para análise IFM
      const optimizedResult = await tokenOptimizationService.optimizeTokenUsage(
        result.text,
        'ifm_analysis'
      );
      
      // Armazenar no cache avançado com categorização e persistência
      cacheService.set(cacheKey, optimizedResult, {
        category: 'ifm_analysis',
        ttl: 30 * 24 * 60 * 60 * 1000, // 30 dias
        persist: true
      });
      
      return optimizedResult;
    } catch (error) {
      logger.error(`Erro ao analisar matriz IFM: ${error.message}`);
      return 'Não foi possível analisar a matriz IFM devido a um erro no processamento.';
    }
  }
  async analyzeTCM(planData) {
    // Verificar se há dados significativos de MTC
    const hasTCMData = planData.constitution !== 'Não avaliado' || 
                      planData.pulseRhythm !== 'Não avaliado' || 
                      planData.tongueColor !== 'Não avaliado';
    
    if (!hasTCMData) {
      return 'Não foram fornecidas observações de Medicina Tradicional Chinesa.';
    }
    
    try {
      // Gerar hash dos dados de MTC para identificação única
      const tcmDataHash = this._generateContentHash({
        constitution: planData.constitution,
        pulseRhythm: planData.pulseRhythm,
        tongueColor: planData.tongueColor,
        elementWood: planData.elementWood,
        elementFire: planData.elementFire,
        elementEarth: planData.elementEarth,
        elementMetal: planData.elementMetal,
        elementWater: planData.elementWater
      });
      const cacheKey = `tcm_${planData.patientName}_${tcmDataHash}`;
      
      // Verificar cache avançado
      const cachedResult = cacheService.get(cacheKey);
      if (cachedResult) {
        logger.info('Usando cache para análise de MTC');
        return cachedResult;
      }
      
      // Criar e executar a cadeia LLM
      const chain = new LLMChain({
        llm: this.model,
        prompt: this.tcmAnalysisTemplate
      });
      
      const result = await chain.call({
        patientName: planData.patientName,
        patientAge: planData.patientAge,
        symptoms: planData.symptoms,
        constitution: planData.constitution,
        pulseRhythm: planData.pulseRhythm,
        pulseStrength: planData.pulseStrength,
        pulseQuality: planData.pulseQuality,
        tongueColor: planData.tongueColor,
        tongueCoating: planData.tongueCoating,
        tongueShape: planData.tongueShape,
        tongueMoisture: planData.tongueMoisture,
        elementWood: planData.elementWood,
        elementFire: planData.elementFire,
        elementEarth: planData.elementEarth,
        elementMetal: planData.elementMetal,
        elementWater: planData.elementWater,
        yinYangBalance: planData.yinYangBalance,
        menstrualHistory: planData.menstrualHistory
      });
      
      // Otimização de tokens para análise TCM
      const optimizedResult = await tokenOptimizationService.optimizeTokenUsage(
        result.text,
        'tcm_analysis'
      );
      
      // Armazenar no cache avançado com categorização e persistência
      cacheService.set(cacheKey, optimizedResult, {
        category: 'tcm_analysis',
        ttl: 30 * 24 * 60 * 60 * 1000, // 30 dias
        persist: true
      });
      
      return optimizedResult;
    } catch (error) {
      logger.error('Erro ao analisar MTC:', error);
      return 'Não foi possível analisar as observações de MTC devido a um erro.';
    }
  }
  
  /**
   * Gera o plano de saúde personalizado completo
   * @param {Object} plan - Dados do plano completo
   * @returns {Promise<Object>} Plano de saúde gerado
   */
  async generatePlan(plan) {
    try {
      logger.info('Iniciando geração de plano de saúde para paciente:', plan.patient?.name);
      
      // Preparar todos os dados do plano para análise
      const planData = await this.preparePlanData(plan);
      
      // Realizar análises específicas em paralelo para melhor performance
      const [examAnalysis, ifmAnalysis, tcmAnalysis, timelineAnalysis] = await Promise.all([
        // Análise de exames de laboratório
        plan.exams && plan.exams.length > 0 ? this.analyzeExams(planData, plan.exams) : 'Sem exames para analisar',
        
        // Análise da matriz IFM
        this.analyzeIFM(planData),
        
        // Análise de Medicina Tradicional Chinesa
        this.analyzeTCM(planData),
        
        // Análise da linha do tempo funcional
        plan.timeline && plan.timeline.length > 0 ? this.analyzeTimeline(planData, plan.timeline) : 'Sem linha do tempo para analisar'
      ]);
      
      // Atualizar o objeto planData com os resultados das análises
      planData.examAnalysis = examAnalysis;
      planData.ifmAnalysis = ifmAnalysis;
      planData.tcmAnalysis = tcmAnalysis;
      planData.timelineAnalysis = timelineAnalysis;
      
      // Criar e executar a cadeia final de geração do plano
      const chain = new LLMChain({
        llm: this.model,
        prompt: this.planGenerationTemplate
      });
      
      // Verificar cache avançado primeiro
      const planContentHash = this._generateContentHash({
        patientName: planData.patientName,
        ifmAnalysis: planData.ifmAnalysis,
        tcmAnalysis: planData.tcmAnalysis,
        timelineAnalysis: planData.timelineAnalysis,
        examAnalysis: planData.examAnalysis
      });
      const cacheKey = `plan_${planData.patientName}_${planContentHash}`;
      
      const cachedResult = cacheService.get(cacheKey);
      if (cachedResult) {
        logger.info('Usando cache para geração do plano completo');
        return cachedResult;
      }
      
      // Realizar a chamada final para geração do plano completo
      logger.info('Integrando análises e gerando plano final');
      const result = await chain.call(planData);
      
      // Otimização de tokens para o plano completo
      const optimizedText = await tokenOptimizationService.optimizeTokenUsage(
        result.text,
        'complete_plan'
      );
      
      // Processar o resultado em formato estruturado
      const generatedPlan = {
        patientName: plan.patient.name,
        generatedDate: new Date().toISOString(),
        analysis: {
          exams: examAnalysis,
          ifm_matrix: ifmAnalysis,
          tcm: tcmAnalysis,
          timeline: timelineAnalysis
        },
        plan: optimizedText,
        recommendations: {
          nutrition: this.extractSection(optimizedText, 'Nutrição'),
          supplements: this.extractSection(optimizedText, 'Suplementação'),
          lifestyle: this.extractSection(optimizedText, 'Estilo de Vida'),
          stress_management: this.extractSection(optimizedText, 'Gerenciamento de Estresse'),
          exercise: this.extractSection(optimizedText, 'Exercícios'),
          sleep: this.extractSection(optimizedText, 'Sono'),
          follow_up: this.extractSection(optimizedText, 'Acompanhamento')
        },
        raw_data: plan // Preservar dados originais para referência
      };
      
      // Armazenar o plano completo no cache avançado
      cacheService.set(cacheKey, generatedPlan, {
        category: 'complete_plan',
        ttl: 30 * 24 * 60 * 60 * 1000, // 30 dias
        persist: true
      });
      
      logger.info('Plano de saúde gerado com sucesso');
      return generatedPlan;
      
    } catch (error) {
      logger.error('Erro ao gerar plano de saúde:', error);
      throw new Error(`Falha ao gerar plano de saúde: ${error.message}`);
    }
  }
  
  /**
   * Extrai uma seção específica do texto do plano
   * @param {string} text - Texto completo do plano
   * @param {string} sectionName - Nome da seção a ser extraída
   * @returns {string} Conteúdo da seção ou mensagem indicando que a seção não foi encontrada
   */
  extractSection(text, sectionName) {
    if (!text) return 'Conteúdo não disponível';
    
    // Buscar a seção no texto
    const sectionRegex = new RegExp(`#+\s*${sectionName}\s*[\r\n]+((?:.|\n)*?)(?:(?=#+\s*\w+)|$)`, 'i');
    const match = text.match(sectionRegex);
    
    if (match && match[1]) {
      return match[1].trim();
    }
    
    return `Recomendações sobre ${sectionName} não encontradas no plano.`;
  }
}
