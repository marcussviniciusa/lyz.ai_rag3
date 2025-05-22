import axios from 'axios';
import authHeader from './auth-header';
import notificationService from './notification.service';
import retryService from './retry.service';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Configurações para retry automático
const DEFAULT_RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000,
  exponential: true,
  onRetry: (attempt, max, error) => {
    notificationService.notify(
      `Tentando reconectar (${attempt}/${max})...`,
      'warning'
    );
  }
};

/**
 * Serviu00e7o para operau00e7u00f5es relacionadas a planos de sau00fade
 */
class PlanService {
  /**
   * Obter lista de planos com filtros e paginau00e7u00e3o
   * @param {Object} options - Opu00e7u00f5es de filtragem e paginau00e7u00e3o
   * @param {number} options.page - Pu00e1gina atual
   * @param {number} options.limit - Limite de itens por pu00e1gina
   * @param {string} options.search - Termo de busca
   * @param {string} options.status - Filtro de status do plano
   * @param {string} options.sort - Campo e direu00e7u00e3o de ordenau00e7u00e3o
   * @returns {Promise} Resposta da API com lista de planos
   */
  getPlans(options = {}) {
    const { page, limit, search, status, sort } = options;
    let url = `${API_URL}/plans?`;
    
    if (page) url += `page=${page}&`;
    if (limit) url += `limit=${limit}&`;
    if (search) url += `search=${encodeURIComponent(search)}&`;
    if (status) url += `status=${status}&`;
    if (sort) url += `sort=${sort}`;
    
    return axios.get(url, { headers: authHeader() });
  }

  /**
   * Obter um plano especu00edfico pelo ID
   * @param {string} id - ID do plano
   * @returns {Promise} Resposta da API com dados do plano
   */
  getPlan(id) {
    return axios.get(`${API_URL}/plans/${id}`, { headers: authHeader() });
  }

  /**
   * Criar um novo plano
   * @param {Object} planData - Dados iniciais do plano
   * @returns {Promise} Resposta da API com plano criado
   */
  createPlan(planData) {
    return axios.post(
      `${API_URL}/plans`,
      planData,
      { headers: authHeader() }
    );
  }

  /**
   * Atualizar um plano existente
   * @param {string} id - ID do plano
   * @param {Object} planData - Dados atualizados do plano
   * @returns {Promise} Resposta da API com plano atualizado
   */
  updatePlan(id, planData) {
    return axios.put(
      `${API_URL}/plans/${id}`,
      planData,
      { headers: authHeader() }
    );
  }

  /**
   * Excluir um plano
   * @param {string} id - ID do plano
   * @returns {Promise} Resposta da API com resultado da operau00e7u00e3o
   */
  deletePlan(id) {
    return axios.delete(
      `${API_URL}/plans/${id}`,
      { headers: authHeader() }
    );
  }
  
  /**
   * Gerar o plano final usando IA com feedback de progresso e mecanismo de retry
   * @param {string} id - ID do plano
   * @param {Object} retryOptions - Opções de retry personalizadas (opcional)
   * @returns {Promise} Resposta da API com plano gerado
   */
  generatePlan(id, retryOptions = {}) {
    // Gerar um ID único para esta operação de geração
    const operationId = `generate-plan-${id}-${Date.now()}`;
    
    // Definir os estágios da geração do plano
    const stages = [
      'Preparando dados da paciente',
      'Analisando exames laboratoriais',
      'Analisando matriz IFM',
      'Analisando observações de MTC',
      'Analisando linha do tempo funcional',
      'Integrando análises',
      'Gerando recomendações personalizadas',
      'Finalizando plano'
    ];
    
    // Iniciar o rastreamento de progresso
    const tracker = notificationService.startProgressTracking(
      operationId,
      stages,
      'Gerando plano de saúde personalizado'
    );
    
    // Definir um intervalo para simular progresso enquanto aguardamos resposta da API
    // Isso fornece feedback visual mesmo quando o servidor não envia atualizações
    let currentStage = 0;
    let progressInterval = null;
    
    // Função para iniciar o intervalo de simulação de progresso
    const startProgressSimulation = () => {
      if (progressInterval) clearInterval(progressInterval);
      
      progressInterval = setInterval(() => {
        // Só avançar estágio se ainda não tivermos chegado ao final
        if (currentStage < stages.length - 1) {
          tracker.updateStage(`Processando: ${stages[currentStage]}...`);
          
          // Periodicamente avançar para o próximo estágio para mostrar progresso
          if (Math.random() > 0.7) { // Probabilidade para avançar estágio
            currentStage++;
            tracker.nextStage(`Iniciando: ${stages[currentStage]}...`);
          }
        }
      }, 3000);
      
      return progressInterval;
    };
    
    // Iniciar simulação de progresso
    progressInterval = startProgressSimulation();
    
    // Configuração do retry para esta operação específica
    const retryConfig = {
      ...DEFAULT_RETRY_CONFIG,
      ...retryOptions,
      // Reiniciar simulação de progresso a cada retry
      onRetry: (attempt, max, error) => {
        tracker.updateStage(`Erro de conexão. Tentando novamente (${attempt}/${max})...`);
        progressInterval = startProgressSimulation();
        
        // Chamar o onRetry original se fornecido
        if (retryOptions.onRetry) {
          retryOptions.onRetry(attempt, max, error);
        } else {
          DEFAULT_RETRY_CONFIG.onRetry(attempt, max, error);
        }
      }
    };
    
    // Usar o serviço de retry para fazer a chamada com retry automático
    return retryService.httpRequestWithRetry(
      () => axios.post(
        `${API_URL}/plans/${id}/generate`,
        { operationId }, // Passar o ID da operação para o servidor
        { headers: authHeader() }
      ),
      retryConfig
    )
    .then(response => {
      // Limpar o intervalo e marcar como concluído
      if (progressInterval) clearInterval(progressInterval);
      tracker.complete('Plano de saúde gerado com sucesso!');
      
      // Verificar e formatar resposta se necessário
      if (response.data) {
        // Salvamento local para caso de queda de conexão futura
        try {
          localStorage.setItem(`plan_backup_${id}`, JSON.stringify({
            timestamp: new Date().toISOString(),
            data: response.data
          }));
        } catch (err) {
          console.warn('Não foi possível salvar backup local do plano:', err);
        }
      }
      
      return response;
    })
    .catch(error => {
      // Limpar o intervalo e notificar erro
      if (progressInterval) clearInterval(progressInterval);
      tracker.error(error.response?.data?.message || 'Erro ao gerar plano de saúde');
      
      // Verificar se há uma versão de backup local para retornar em caso de falha completa
      const backupStr = localStorage.getItem(`plan_backup_${id}`);
      if (backupStr) {
        try {
          const backup = JSON.parse(backupStr);
          // Se o backup foi criado há menos de 24 horas, podemos usá-lo
          const backupTime = new Date(backup.timestamp);
          const now = new Date();
          const hoursSinceBackup = (now - backupTime) / (1000 * 60 * 60);
          
          if (hoursSinceBackup < 24) {
            notificationService.notify(
              'Usando versão em cache do plano devido a problemas de conexão',
              'warning'
            );
            return { data: backup.data, fromCache: true };
          }
        } catch (err) {
          console.error('Erro ao processar backup do plano:', err);
        }
      }
      
      throw error;
    });
  }
  
  /**
   * Exportar plano como PDF
   * @param {string} id - ID do plano
   * @returns {Promise} Resposta da API com URL do PDF gerado
   */
  exportPlanPDF(id) {
    return axios.get(
      `${API_URL}/plans/${id}/export/pdf`,
      { 
        headers: authHeader(),
        responseType: 'blob' 
      }
    );
  }
  
  /**
   * Fazer upload de um arquivo para o plano (ex: exames)
   * @param {string} id - ID do plano
   * @param {string} type - Tipo de arquivo (exam, report, etc)
   * @param {File} file - Arquivo a ser enviado
   * @returns {Promise} Resposta da API com informau00e7u00f5es do arquivo
   */
  uploadFile(id, type, file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    return axios.post(
      `${API_URL}/plans/${id}/files`,
      formData,
      { 
        headers: {
          ...authHeader(),
          'Content-Type': 'multipart/form-data'
        }
      }
    );
  }
  
  /**
   * Remover um arquivo do plano
   * @param {string} planId - ID do plano
   * @param {string} fileId - ID do arquivo
   * @returns {Promise} Resposta da API com resultado da operau00e7u00e3o
   */
  deleteFile(planId, fileId) {
    return axios.delete(
      `${API_URL}/plans/${planId}/files/${fileId}`,
      { headers: authHeader() }
    );
  }
  
  /**
   * Obter estatu00edsticas dos planos para o dashboard
   * @returns {Promise} Resposta da API com estatu00edsticas
   */
  getStats() {
    return axios.get(
      `${API_URL}/plans/stats`,
      { headers: authHeader() }
    );
  }
  
  /**
   * Analisar exames utilizando IA
   * @param {string} planId - ID do plano
   * @param {Array} fileIds - Lista de IDs de arquivos a serem analisados
   * @returns {Promise} Resposta da API com resultado da anu00e1lise
   */
  analyzeExams(planId, fileIds) {
    return axios.post(
      `${API_URL}/plans/${planId}/analyze`,
      { fileIds },
      { headers: authHeader() }
    );
  }
}

export default new PlanService();
