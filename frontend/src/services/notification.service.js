import { Subject } from 'rxjs';

/**
 * Serviço para gerenciar notificações e feedbacks de progresso na aplicação
 */
class NotificationService {
  constructor() {
    // Subjects para diferentes tipos de mensagens
    this.progressSubject = new Subject();
    this.notificationSubject = new Subject();
    this.errorSubject = new Subject();

    // Observable público para componentes se inscreverem
    this.progress$ = this.progressSubject.asObservable();
    this.notification$ = this.notificationSubject.asObservable();
    this.error$ = this.errorSubject.asObservable();
  }

  /**
   * Atualiza o progresso de uma operação
   * @param {string} operationId - Identificador único da operação
   * @param {number} percentComplete - Percentual concluído (0-100)
   * @param {string} message - Mensagem descritiva do estágio atual
   * @param {Object} data - Dados adicionais relacionados ao progresso
   */
  updateProgress(operationId, percentComplete, message, data = {}) {
    this.progressSubject.next({
      operationId,
      percentComplete,
      message,
      timestamp: new Date(),
      data
    });
  }

  /**
   * Inicia um rastreamento de progresso com estágios definidos
   * @param {string} operationId - Identificador único da operação
   * @param {Array} stages - Lista de estágios da operação
   * @param {string} title - Título da operação
   * @returns {Object} - Objeto com métodos para atualizar o progresso
   */
  startProgressTracking(operationId, stages, title) {
    const totalStages = stages.length;
    let currentStageIndex = 0;

    // Notificar início
    this.updateProgress(operationId, 0, `Iniciando: ${title}`, { 
      stage: stages[0],
      stageIndex: 0,
      totalStages: totalStages,
      title
    });

    // Retornar controlador de progresso
    return {
      // Avançar para o próximo estágio
      nextStage: (message = '') => {
        currentStageIndex++;
        if (currentStageIndex >= totalStages) {
          return this.completeProgress(operationId, 'Operação concluída com sucesso');
        }
        
        const percentComplete = Math.floor((currentStageIndex / totalStages) * 100);
        const currentStage = stages[currentStageIndex];
        
        this.updateProgress(operationId, percentComplete, message || `Em andamento: ${currentStage}`, {
          stage: currentStage,
          stageIndex: currentStageIndex,
          totalStages: totalStages,
          title
        });
        
        return currentStageIndex;
      },
      
      // Atualizar estágio atual (sem avançar)
      updateStage: (message, percentOverride = null) => {
        const percentComplete = percentOverride !== null ? 
          percentOverride : 
          Math.floor((currentStageIndex / totalStages) * 100);
          
        this.updateProgress(operationId, percentComplete, message, {
          stage: stages[currentStageIndex],
          stageIndex: currentStageIndex,
          totalStages: totalStages,
          title
        });
      },
      
      // Finalizar processo com sucesso
      complete: (message = 'Operação concluída com sucesso') => {
        this.completeProgress(operationId, message);
      },
      
      // Finalizar processo com erro
      error: (message) => {
        this.errorSubject.next({
          operationId,
          message,
          timestamp: new Date()
        });
      }
    };
  }

  /**
   * Marca uma operação como concluída
   * @param {string} operationId - Identificador único da operação
   * @param {string} message - Mensagem de conclusão
   */
  completeProgress(operationId, message) {
    this.updateProgress(operationId, 100, message);
    this.notificationSubject.next({
      operationId,
      message,
      type: 'success',
      timestamp: new Date()
    });
  }

  /**
   * Envia uma notificação para o usuário
   * @param {string} message - Conteúdo da notificação
   * @param {string} type - Tipo (info, success, warning, error)
   * @param {Object} data - Dados adicionais
   */
  notify(message, type = 'info', data = {}) {
    this.notificationSubject.next({
      message,
      type,
      timestamp: new Date(),
      data
    });
  }

  /**
   * Registra e notifica um erro
   * @param {string} message - Mensagem de erro
   * @param {Error|Object} error - Objeto de erro ou detalhes
   * @param {string} operationId - Identificador da operação relacionada
   */
  notifyError(message, error, operationId = null) {
    console.error(message, error);
    
    this.errorSubject.next({
      message,
      error,
      operationId,
      timestamp: new Date()
    });
  }
}

// Criar instância única para toda a aplicação
const notificationService = new NotificationService();

export default notificationService;
