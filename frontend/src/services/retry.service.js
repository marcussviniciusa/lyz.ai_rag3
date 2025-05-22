/**
 * Serviço para gerenciar tentativas automáticas de requisições em caso de falhas
 */
class RetryService {
  /**
   * Executa uma função assíncrona com retry automático em caso de falha
   * 
   * @param {Function} asyncFn - Função assíncrona a ser executada
   * @param {Object} options - Opções de configuração
   * @param {number} options.maxRetries - Número máximo de tentativas (default: 3)
   * @param {number} options.baseDelay - Atraso base em ms entre tentativas (default: 1000)
   * @param {boolean} options.exponential - Se o atraso deve aumentar exponencialmente (default: true)
   * @param {Function} options.onRetry - Callback chamado antes de cada nova tentativa
   * @param {Function} options.shouldRetry - Função que determina se deve tentar novamente com base no erro
   * @returns {Promise} - Promessa resolvida com o resultado da função ou rejeitada após todas as tentativas
   */
  async retry(asyncFn, options = {}) {
    const {
      maxRetries = 3,
      baseDelay = 1000,
      exponential = true,
      onRetry = null,
      shouldRetry = (error) => true
    } = options;
    
    let lastError = null;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // Na primeira tentativa, não há atraso
        if (attempt > 0) {
          // Calcular atraso para esta tentativa
          const delay = exponential
            ? baseDelay * Math.pow(2, attempt - 1) // Backoff exponencial
            : baseDelay; // Backoff linear
          
          // Adicionar jitter (variação aleatória) para evitar sincronização
          const jitter = Math.random() * 0.3 * delay;
          const finalDelay = delay + jitter;
          
          // Aguardar antes de tentar novamente
          await new Promise(resolve => setTimeout(resolve, finalDelay));
          
          // Chamar callback de retry se fornecido
          if (onRetry && typeof onRetry === 'function') {
            onRetry(attempt, maxRetries, lastError);
          }
        }
        
        // Executar a função
        return await asyncFn();
      } catch (error) {
        lastError = error;
        
        // Verificar se devemos tentar novamente com base no erro
        const retry = attempt < maxRetries && shouldRetry(error);
        
        // Se não devemos tentar novamente ou já tentamos o máximo, propagar o erro
        if (!retry) {
          throw error;
        }
      }
    }
    
    // Este ponto só deve ser alcançado se algo inesperado acontecer
    throw lastError || new Error('Falha na operação após múltiplas tentativas');
  }
  
  /**
   * Função auxiliar para determinar se uma requisição deve ser repetida com base no erro HTTP
   * @param {Error} error - Erro da requisição
   * @returns {boolean} - Se deve tentar novamente
   */
  shouldRetryHttpRequest(error) {
    // Não temos erro
    if (!error) return false;
    
    // Erro de rede (offline, timeout, etc)
    if (!error.response) return true;
    
    // Códigos de erro que indicam problemas temporários
    const retryStatusCodes = [408, 429, 500, 502, 503, 504];
    
    return retryStatusCodes.includes(error.response.status);
  }
  
  /**
   * Wrapper para requisições HTTP com retry automático
   * 
   * @param {Function} requestFn - Função que faz a requisição HTTP
   * @param {Object} retryOptions - Opções para o retry
   * @returns {Promise} - Promessa resolvida com a resposta ou rejeitada após tentativas
   */
  async httpRequestWithRetry(requestFn, retryOptions = {}) {
    return this.retry(
      requestFn,
      {
        maxRetries: 3,
        baseDelay: 1000,
        exponential: true,
        shouldRetry: this.shouldRetryHttpRequest,
        ...retryOptions
      }
    );
  }
}

// Criar instância única para toda a aplicação
const retryService = new RetryService();

export default retryService;
