/**
 * Serviço de cache avançado para armazenar e gerenciar resultados
 * de chamadas à API de modelos de linguagem
 */
const fs = require('fs');
const path = require('path');
const logger = require('../config/logger');

class CacheService {
  constructor() {
    // Cache em memória usando um Map para armazenamento rápido
    this.memoryCache = new Map();
    
    // Configurações
    this.defaultTTL = 24 * 60 * 60 * 1000; // 24 horas em milissegundos
    this.persistenceEnabled = true;
    this.persistencePath = path.join(__dirname, '../../cache');
    this.persistenceInterval = 30 * 60 * 1000; // 30 minutos
    
    // Estatísticas de uso do cache
    this.stats = {
      hits: 0,
      misses: 0,
      itemsStored: 0,
      lastPersistence: null
    };
    
    // Criar diretório de cache se não existir
    if (this.persistenceEnabled && !fs.existsSync(this.persistencePath)) {
      fs.mkdirSync(this.persistencePath, { recursive: true });
      logger.info(`Diretório de cache criado em ${this.persistencePath}`);
    }
    
    // Carregar cache persistido se existir
    this._loadPersistedCache();
    
    // Configurar persistência periódica
    if (this.persistenceEnabled) {
      this._setupPersistenceInterval();
    }
  }
  
  /**
   * Obtém um item do cache
   * @param {string} key - Chave única para o item
   * @returns {any|null} Item armazenado ou null se não encontrado/expirado
   */
  get(key) {
    if (!this.memoryCache.has(key)) {
      this.stats.misses++;
      logger.debug(`Cache miss para chave: ${key}`);
      return null;
    }
    
    const item = this.memoryCache.get(key);
    
    // Verificar se o item expirou
    if (item.expiry && item.expiry < Date.now()) {
      this.memoryCache.delete(key);
      this.stats.misses++;
      logger.debug(`Cache expirado para chave: ${key}`);
      return null;
    }
    
    // Registrar hit e atualizar último acesso
    this.stats.hits++;
    item.lastAccessed = Date.now();
    logger.debug(`Cache hit para chave: ${key}`);
    
    return item.value;
  }
  
  /**
   * Armazena um item no cache
   * @param {string} key - Chave única para o item
   * @param {any} value - Valor a ser armazenado
   * @param {Object} options - Opções de armazenamento
   * @param {number} [options.ttl] - Tempo de vida em milissegundos
   * @param {boolean} [options.persist] - Se o item deve ser persistido
   * @param {string} [options.category] - Categoria do item para agrupamento
   */
  set(key, value, options = {}) {
    const ttl = options.ttl || this.defaultTTL;
    const persist = options.persist !== undefined ? options.persist : this.persistenceEnabled;
    const category = options.category || 'default';
    
    const item = {
      value,
      created: Date.now(),
      lastAccessed: Date.now(),
      expiry: ttl > 0 ? Date.now() + ttl : null,
      persist,
      category
    };
    
    this.memoryCache.set(key, item);
    this.stats.itemsStored = this.memoryCache.size;
    
    logger.debug(`Item armazenado em cache com chave: ${key}, categoria: ${category}`);
    
    // Persistir imediatamente se solicitado
    if (persist && options.persistNow) {
      this._persistItem(key, item);
    }
    
    return true;
  }
  
  /**
   * Remove um item do cache
   * @param {string} key - Chave do item a ser removido
   * @returns {boolean} true se o item foi removido, false caso contrário
   */
  delete(key) {
    const removed = this.memoryCache.delete(key);
    
    if (removed) {
      this.stats.itemsStored = this.memoryCache.size;
      logger.debug(`Item removido do cache: ${key}`);
      
      // Remover arquivo persistido se existir
      if (this.persistenceEnabled) {
        const filePath = path.join(this.persistencePath, `${key}.json`);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          logger.debug(`Cache persistido removido: ${filePath}`);
        }
      }
    }
    
    return removed;
  }
  
  /**
   * Limpa todo o cache ou apenas uma categoria
   * @param {string} [category] - Categoria específica para limpar
   * @returns {number} Número de itens removidos
   */
  clear(category) {
    let count = 0;
    
    if (category) {
      // Limpar apenas uma categoria específica
      for (const [key, item] of this.memoryCache.entries()) {
        if (item.category === category) {
          this.delete(key);
          count++;
        }
      }
    } else {
      // Limpar todo o cache
      count = this.memoryCache.size;
      this.memoryCache.clear();
      this.stats.itemsStored = 0;
      
      // Limpar arquivos persistidos
      if (this.persistenceEnabled && fs.existsSync(this.persistencePath)) {
        fs.readdirSync(this.persistencePath)
          .filter(file => file.endsWith('.json'))
          .forEach(file => {
            fs.unlinkSync(path.join(this.persistencePath, file));
          });
      }
    }
    
    logger.info(`Cache limpo${category ? ` para categoria ${category}` : ''}. ${count} itens removidos.`);
    return count;
  }
  
  /**
   * Invalida itens do cache com base em um critério
   * @param {Function} predicate - Função que retorna true para itens a serem invalidados
   * @returns {number} Número de itens invalidados
   */
  invalidate(predicate) {
    if (typeof predicate !== 'function') {
      throw new Error('Predicado deve ser uma função');
    }
    
    const keysToInvalidate = [];
    
    for (const [key, item] of this.memoryCache.entries()) {
      if (predicate(item.value, key, item)) {
        keysToInvalidate.push(key);
      }
    }
    
    keysToInvalidate.forEach(key => this.delete(key));
    
    logger.info(`Invalidação de cache executada. ${keysToInvalidate.length} itens invalidados.`);
    return keysToInvalidate.length;
  }
  
  /**
   * Obtém estatísticas de uso do cache
   * @returns {Object} Estatísticas atualizadas
   */
  getStats() {
    const hitRatio = (this.stats.hits + this.stats.misses) > 0 ?
      this.stats.hits / (this.stats.hits + this.stats.misses) : 0;
    
    return {
      ...this.stats,
      hitRatio: hitRatio.toFixed(2),
      memoryUsage: this._estimateMemoryUsage(),
      categories: this._getCategoriesStats()
    };
  }
  
  /**
   * Persiste todo o cache em disco
   * @returns {boolean} true se a persistência foi bem-sucedida
   */
  persistCache() {
    if (!this.persistenceEnabled) {
      logger.warn('Tentativa de persistir cache com persistência desabilitada');
      return false;
    }
    
    try {
      // Garantir que o diretório existe
      if (!fs.existsSync(this.persistencePath)) {
        fs.mkdirSync(this.persistencePath, { recursive: true });
      }
      
      // Persistir itens marcados para persistência
      let persistedCount = 0;
      
      for (const [key, item] of this.memoryCache.entries()) {
        if (item.persist) {
          this._persistItem(key, item);
          persistedCount++;
        }
      }
      
      this.stats.lastPersistence = Date.now();
      logger.info(`Cache persistido com sucesso. ${persistedCount} itens salvos.`);
      return true;
    } catch (error) {
      logger.error(`Erro ao persistir cache: ${error.message}`);
      return false;
    }
  }
  
  /**
   * Configura intervalo para persistência automática
   * @private
   */
  _setupPersistenceInterval() {
    setInterval(() => {
      this.persistCache();
    }, this.persistenceInterval);
    
    logger.info(`Persistência automática configurada a cada ${this.persistenceInterval / 60000} minutos`);
    
    // Persistir também ao encerrar o processo
    process.on('SIGINT', () => {
      logger.info('Persistindo cache antes de encerrar...');
      this.persistCache();
      process.exit(0);
    });
  }
  
  /**
   * Carrega cache previamente persistido
   * @private
   */
  _loadPersistedCache() {
    if (!this.persistenceEnabled || !fs.existsSync(this.persistencePath)) {
      return;
    }
    
    try {
      const files = fs.readdirSync(this.persistencePath)
        .filter(file => file.endsWith('.json'));
      
      let loadedCount = 0;
      for (const file of files) {
        try {
          const filePath = path.join(this.persistencePath, file);
          const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          
          // Verificar se o item expirou
          if (data.expiry && data.expiry < Date.now()) {
            fs.unlinkSync(filePath);
            continue;
          }
          
          const key = file.replace('.json', '');
          this.memoryCache.set(key, data);
          loadedCount++;
        } catch (err) {
          logger.error(`Erro ao carregar arquivo de cache ${file}: ${err.message}`);
        }
      }
      
      this.stats.itemsStored = this.memoryCache.size;
      logger.info(`Cache carregado com sucesso. ${loadedCount} itens restaurados.`);
    } catch (error) {
      logger.error(`Erro ao carregar cache persistido: ${error.message}`);
    }
  }
  
  /**
   * Persiste um único item em disco
   * @param {string} key - Chave do item
   * @param {Object} item - Item a ser persistido
   * @private
   */
  _persistItem(key, item) {
    try {
      const filePath = path.join(this.persistencePath, `${key}.json`);
      fs.writeFileSync(filePath, JSON.stringify(item), 'utf8');
    } catch (error) {
      logger.error(`Erro ao persistir item ${key}: ${error.message}`);
    }
  }
  
  /**
   * Estima o uso de memória do cache
   * @returns {string} Uso de memória estimado em formato legível
   * @private
   */
  _estimateMemoryUsage() {
    let totalSize = 0;
    
    for (const [key, item] of this.memoryCache.entries()) {
      // Estimar tamanho da chave e metadados
      totalSize += key.length * 2; // Cada caractere usa 2 bytes em UTF-16
      totalSize += 8 * 3; // Timestamps (created, lastAccessed, expiry)
      totalSize += 4; // Booleanos e outros metadados
      
      // Estimar tamanho do valor
      if (typeof item.value === 'string') {
        totalSize += item.value.length * 2;
      } else {
        totalSize += 1024; // Estimativa grosseira para objetos complexos
      }
    }
    
    // Converter para unidade apropriada
    if (totalSize < 1024) {
      return `${totalSize} bytes`;
    } else if (totalSize < 1024 * 1024) {
      return `${(totalSize / 1024).toFixed(2)} KB`;
    } else {
      return `${(totalSize / (1024 * 1024)).toFixed(2)} MB`;
    }
  }
  
  /**
   * Obtém estatísticas agrupadas por categoria
   * @returns {Object} Estatísticas por categoria
   * @private
   */
  _getCategoriesStats() {
    const categories = {};
    
    for (const item of this.memoryCache.values()) {
      const category = item.category || 'default';
      
      if (!categories[category]) {
        categories[category] = { count: 0 };
      }
      
      categories[category].count++;
    }
    
    return categories;
  }
}

// Exportar instância única (singleton)
module.exports = new CacheService();
