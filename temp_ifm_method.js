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
      
      // Armazenar no cache avançado com categorização e persistência
      cacheService.set(cacheKey, result.text, {
        category: 'ifm_analysis',
        ttl: 30 * 24 * 60 * 60 * 1000, // 30 dias
        persist: true
      });
      
      return result.text;
    } catch (error) {
      logger.error('Erro ao analisar matriz IFM:', error);
      return 'Não foi possível analisar a matriz IFM devido a um erro.';
    }
  }
