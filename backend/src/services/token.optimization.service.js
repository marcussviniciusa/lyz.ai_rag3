const logger = require('../config/logger');

/**
 * Serviu00e7o para otimizau00e7u00e3o e monitoramento de uso de tokens nas requisiu00e7u00f5es u00e0 API OpenAI
 */
class TokenOptimizationService {
  constructor() {
    // Mapa para armazenar mu00e9tricas de uso por empresa/usuu00e1rio
    this.usageMetrics = new Map();
    
    // Estimativa de tokens por caractere (aproximadamente)
    this.tokensPerCharRatio = 0.25; // ~4 caracteres por token
    
    // Limites de tamanho para diferentes componentes do plano
    this.sizeThresholds = {
      symptomLimit: 15,      // Limite de sintomas a serem incluu00eddos
      examLimit: 20,         // Limite de exames a incluir
      timelineLimit: 20,     // Limite de eventos da linha do tempo
      notesSizeLimit: 1000,  // Limite de caracteres para notas
      descriptionLimit: 300  // Limite de caracteres para descriu00e7u00f5es longas
    };
  }
  
  /**
   * Estima o nu00famero de tokens em um texto
   * @param {string} text - Texto para estimar tokens
   * @returns {number} Nu00famero estimado de tokens
   */
  estimateTokens(text) {
    if (!text) return 0;
    return Math.ceil(text.length * this.tokensPerCharRatio);
  }
  
  /**
   * Registra o uso de tokens por uma empresa/usuu00e1rio
   * @param {string} companyId - ID da empresa
   * @param {string} userId - ID do usuu00e1rio
   * @param {number} promptTokens - Nu00famero de tokens no prompt
   * @param {number} completionTokens - Nu00famero de tokens na resposta
   * @param {string} model - Modelo usado (ex: gpt-4)
   * @param {string} operationType - Tipo de operau00e7u00e3o (ex: generatePlan, analyzeExams)
   */
  trackTokenUsage(companyId, userId, promptTokens, completionTokens, model, operationType) {
    const totalTokens = promptTokens + completionTokens;
    const timestamp = new Date();
    const monthYear = `${timestamp.getMonth() + 1}-${timestamp.getFullYear()}`;
    
    // Criar chaves para mu00e9tricas
    const companyKey = `company:${companyId}`;
    const userKey = `user:${userId}`;
    
    // Atualizar mu00e9tricas da empresa
    if (!this.usageMetrics.has(companyKey)) {
      this.usageMetrics.set(companyKey, { total: 0, monthly: {}, operations: {} });
    }
    
    const companyMetrics = this.usageMetrics.get(companyKey);
    companyMetrics.total += totalTokens;
    
    if (!companyMetrics.monthly[monthYear]) {
      companyMetrics.monthly[monthYear] = 0;
    }
    companyMetrics.monthly[monthYear] += totalTokens;
    
    if (!companyMetrics.operations[operationType]) {
      companyMetrics.operations[operationType] = 0;
    }
    companyMetrics.operations[operationType] += totalTokens;
    
    // Atualizar mu00e9tricas do usuu00e1rio
    if (!this.usageMetrics.has(userKey)) {
      this.usageMetrics.set(userKey, { total: 0, monthly: {}, operations: {} });
    }
    
    const userMetrics = this.usageMetrics.get(userKey);
    userMetrics.total += totalTokens;
    
    if (!userMetrics.monthly[monthYear]) {
      userMetrics.monthly[monthYear] = 0;
    }
    userMetrics.monthly[monthYear] += totalTokens;
    
    if (!userMetrics.operations[operationType]) {
      userMetrics.operations[operationType] = 0;
    }
    userMetrics.operations[operationType] += totalTokens;
    
    // Registrar uso
    logger.info(`Token usage: ${totalTokens} tokens (${promptTokens} prompt, ${completionTokens} completion) for ${operationType} by user ${userId} of company ${companyId} using ${model}`);
    
    // Retornar as mu00e9tricas atualizadas para uso posterior
    return {
      totalTokens,
      promptTokens,
      completionTokens,
      timestamp,
      model,
      operationType,
      companyId,
      userId
    };
  }
  
  /**
   * Obtém as mu00e9tricas de uso para uma empresa especu00edfica
   * @param {string} companyId - ID da empresa
   * @returns {Object} Mu00e9tricas de uso da empresa
   */
  getCompanyMetrics(companyId) {
    const companyKey = `company:${companyId}`;
    return this.usageMetrics.has(companyKey) ? 
      this.usageMetrics.get(companyKey) : 
      { total: 0, monthly: {}, operations: {} };
  }
  
  /**
   * Obtém as mu00e9tricas de uso para um usuu00e1rio especu00edfico
   * @param {string} userId - ID do usuu00e1rio
   * @returns {Object} Mu00e9tricas de uso do usuu00e1rio
   */
  getUserMetrics(userId) {
    const userKey = `user:${userId}`;
    return this.usageMetrics.has(userKey) ? 
      this.usageMetrics.get(userKey) : 
      { total: 0, monthly: {}, operations: {} };
  }
  
  /**
   * Prioriza e filtra sintomas com base na sua importu00e2ncia para economizar tokens
   * @param {Array} symptoms - Lista de sintomas
   * @returns {Array} Lista de sintomas priorizada e otimizada
   */
  prioritizeSymptoms(symptoms) {
    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return [];
    }
    
    // Ordenar por prioridade (menor nu00famero = maior prioridade)
    const sortedSymptoms = [...symptoms].sort((a, b) => {
      // Prioridade explu00edcita primeiro
      if (a.priority !== undefined && b.priority !== undefined) {
        return a.priority - b.priority;
      }
      // Se tiver severidade, usar como segundo critu00e9rio
      if (a.severity !== undefined && b.severity !== undefined) {
        return b.severity - a.severity;
      }
      return 0;
    });
    
    // Limitar o nu00famero de sintomas
    const limitedSymptoms = sortedSymptoms.slice(0, this.sizeThresholds.symptomLimit);
    
    // Otimizar descriu00e7u00f5es muito longas
    return limitedSymptoms.map(symptom => {
      if (symptom.description && symptom.description.length > this.sizeThresholds.descriptionLimit) {
        return {
          ...symptom,
          description: symptom.description.substring(0, this.sizeThresholds.descriptionLimit) + '...'
        };
      }
      return symptom;
    });
  }
  
  /**
   * Otimiza um objeto de dados de plano para reduzir o uso de tokens
   * @param {Object} planData - Dados completos do plano
   * @returns {Object} Dados do plano otimizados
   */
  optimizePlanData(planData) {
    if (!planData) return {};
    
    // Criar uma cu00f3pia para nu00e3o modificar o original
    const optimized = { ...planData };
    
    // Otimizar sintomas
    if (optimized.symptoms && Array.isArray(optimized.symptoms)) {
      optimized.symptoms = this.prioritizeSymptoms(optimized.symptoms);
    }
    
    // Otimizar exames (limitar quantidade e tamanho das descriu00e7u00f5es)
    if (optimized.exams && Array.isArray(optimized.exams)) {
      optimized.exams = optimized.exams
        .slice(0, this.sizeThresholds.examLimit)
        .map(exam => {
          // Simplificar objeto de exame
          const optimizedExam = {
            name: exam.name,
            date: exam.date,
            results: []
          };
          
          // Limitar resultados de exames
          if (exam.results && Array.isArray(exam.results)) {
            optimizedExam.results = exam.results.map(result => {
              // Remover campos desnecessu00e1rios e limitar tamanho de notas
              const optimizedResult = {
                name: result.name,
                value: result.value,
                unit: result.unit,
                reference: result.reference
              };
              
              if (result.notes && result.notes.length > this.sizeThresholds.descriptionLimit) {
                optimizedResult.notes = result.notes.substring(0, this.sizeThresholds.descriptionLimit) + '...';
              } else if (result.notes) {
                optimizedResult.notes = result.notes;
              }
              
              return optimizedResult;
            });
          }
          
          return optimizedExam;
        });
    }
    
    // Otimizar linha do tempo (limitar eventos e descriu00e7u00f5es)
    if (optimized.timeline && Array.isArray(optimized.timeline)) {
      optimized.timeline = optimized.timeline
        .slice(0, this.sizeThresholds.timelineLimit)
        .map(event => {
          const optimizedEvent = { ...event };
          
          if (event.description && event.description.length > this.sizeThresholds.descriptionLimit) {
            optimizedEvent.description = event.description.substring(0, this.sizeThresholds.descriptionLimit) + '...';
          }
          
          return optimizedEvent;
        });
    }
    
    // Otimizar notas (limitar tamanho)
    if (optimized.notes && typeof optimized.notes === 'string' && 
        optimized.notes.length > this.sizeThresholds.notesSizeLimit) {
      optimized.notes = optimized.notes.substring(0, this.sizeThresholds.notesSizeLimit) + 
        `... [Nota: ${optimized.notes.length - this.sizeThresholds.notesSizeLimit} caracteres adicionais foram truncados para economizar tokens]`;
    }
    
    // Estimar economia de tokens
    let originalSize = 0;
    let optimizedSize = 0;
    
    try {
      originalSize = this.estimateTokens(JSON.stringify(planData));
      optimizedSize = this.estimateTokens(JSON.stringify(optimized));
      
      logger.info(`Token optimization: ${originalSize - optimizedSize} tokens saved (${Math.round((1 - optimizedSize / originalSize) * 100)}% reduction)`);
    } catch (error) {
      logger.error('Error estimating token savings:', error);
    }
    
    return optimized;
  }
  
  /**
   * Comprime inteligentemente o texto removendo redundu00e2ncias e formatando de maneira eficiente
   * @param {string} text - Texto original
   * @returns {string} Texto comprimido
   */
  compressText(text) {
    if (!text) return '';
    
    // Remover linhas em branco repetidas
    let compressed = text.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    // Remover espau00e7os extras
    compressed = compressed.replace(/\s{2,}/g, ' ');
    
    // Simplificar frases repetitivas comuns
    const replacements = [
      { pattern: /n[aã]o foi poss[ií]vel determinar/gi, replacement: 'indeterminado' },
      { pattern: /de acordo com (os|as) (resultados|análises)/gi, replacement: 'segundo os dados' },
      { pattern: /como (pode ser|podemos) (visto|observado)/gi, replacement: 'como visto' },
      { pattern: /é importante (notar|ressaltar|destacar) que/gi, replacement: 'note que' }
    ];
    
    replacements.forEach(({ pattern, replacement }) => {
      compressed = compressed.replace(pattern, replacement);
    });
    
    // Calcular economia
    const originalTokens = this.estimateTokens(text);
    const compressedTokens = this.estimateTokens(compressed);
    const tokensSaved = originalTokens - compressedTokens;
    
    if (tokensSaved > 0) {
      logger.debug(`Text compression saved approximately ${tokensSaved} tokens`);
    }
    
    return compressed;
  }
}

module.exports = new TokenOptimizationService();
