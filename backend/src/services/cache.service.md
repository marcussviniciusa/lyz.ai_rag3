# Serviu00e7o de Cache Avanu00e7ado

## Visu00e3o Geral
O `CacheService` u00e9 um sistema de cache avanu00e7ado para armazenar e gerenciar resultados de chamadas u00e0 API de modelos de linguagem. Ele implementa um cache em memu00f3ria com persistu00eancia em disco, estratu00e9gias de invalidau00e7u00e3o controlada e mu00e9tricas de uso detalhadas para otimizar o desempenho e reduzir custos com APIs externas no sistema Lyz Healthcare.

## Funcionalidades Principais

### Sistema de Cache em Memu00f3ria
- Armazenamento ru00e1pido usando a estrutura Map do JavaScript
- Configurau00e7u00e3o de TTL (Time-To-Live) global e por item
- Agrupamento de itens por categorias para gestu00e3o granular
- Rastreamento de estatu00edsticas de uso (hits, misses, quantidade de itens)

### Invalidau00e7u00e3o Controlada de Cache
- Invalidau00e7u00e3o baseada em predicados personalizados
- Remou00e7u00e3o seletiva por chave, categoria ou condiu00e7u00e3o
- Expirau00e7u00e3o automu00e1tica baseada no TTL configurado
- Limpeza completa ou parcial do cache

### Persistu00eancia de Resultados
- Serializau00e7u00e3o e armazenamento em disco de itens importantes
- Persistu00eancia automu00e1tica em intervalos configuru00e1veis
- Persistu00eancia antes do encerramento do processo (graceful shutdown)
- Carregamento automu00e1tico de dados persistidos na inicializau00e7u00e3o

### Monitoramento e Mu00e9tricas
- Estatu00edsticas detalhadas de uso do cache
- Taxa de acertos (hit ratio) para avaliau00e7u00e3o de eficu00e1cia
- Estimau00e7u00e3o de uso de memu00f3ria
- Estatu00edsticas por categoria de item

## Mu00e9todos Principais

### `get(key)`
Obtu00e9m um item do cache pela chave fornecida.

**Paru00e2metros:**
- `key` (string): Chave u00fanica do item a ser recuperado

**Retorno:**
- O valor armazenado ou `null` se o item nu00e3o existir ou estiver expirado

**Processo:**
- Verifica se a chave existe no cache
- Valida se o item nu00e3o expirou
- Registra a operau00e7u00e3o como hit ou miss
- Atualiza timestamp de u00faltimo acesso

### `set(key, value, options)`
Armazena um item no cache.

**Paru00e2metros:**
- `key` (string): Chave u00fanica para o item
- `value` (any): Valor a ser armazenado
- `options` (Object): Opu00e7u00f5es de armazenamento
  - `ttl` (number, opcional): Tempo de vida em milissegundos
  - `persist` (boolean, opcional): Se o item deve ser persistido em disco
  - `category` (string, opcional): Categoria do item para agrupamento
  - `persistNow` (boolean, opcional): Foru00e7a persistu00eancia imediata

**Retorno:**
- `true` se o armazenamento foi bem-sucedido

### `delete(key)`
Remove um item do cache.

**Paru00e2metros:**
- `key` (string): Chave do item a ser removido

**Retorno:**
- `true` se o item foi removido, `false` caso contru00e1rio

### `clear(category)`
Limpa todo o cache ou apenas uma categoria especu00edfica.

**Paru00e2metros:**
- `category` (string, opcional): Categoria a ser limpa

**Retorno:**
- Nu00famero de itens removidos

### `invalidate(predicate)`
Invalida itens do cache com base em um predicado.

**Paru00e2metros:**
- `predicate` (Function): Funu00e7u00e3o que retorna `true` para itens a serem invalidados

**Retorno:**
- Nu00famero de itens invalidados

### `getStats()`
Obtu00e9m estatu00edsticas detalhadas sobre o uso do cache.

**Retorno:**
- Objeto com estatu00edsticas como hits, misses, hit ratio, uso de memu00f3ria e agrupamento por categoria

### `persistCache()`
Persiste manualmente todos os itens marcu00e1veis do cache em disco.

**Retorno:**
- `true` se a persistu00eancia foi bem-sucedida, `false` caso contru00e1rio

## Exemplo de Uso

### Armazenamento e Recuperau00e7u00e3o Bu00e1sica
```javascript
const cacheService = require('../services/cache.service');

// Armazenar um resultado de anu00e1lise
const analysisResult = "Detalhada anu00e1lise dos exames...";
cacheService.set('analysis_user123', analysisResult, {
  ttl: 7 * 24 * 60 * 60 * 1000, // 7 dias
  category: 'analysis',
  persist: true
});

// Recuperar o resultado posteriormente
const cachedResult = cacheService.get('analysis_user123');
if (cachedResult) {
  console.log('Resultado recuperado do cache!');
  return cachedResult;
} else {
  console.log('Cache miss, gerando nova anu00e1lise...');
  // Executar anu00e1lise novamente
}
```

### Invalidau00e7u00e3o Seletiva
```javascript
// Invalidar todos os resultados relacionados a um usuu00e1rio
cacheService.invalidate((value, key) => {
  return key.includes('user123');
});

// Limpar todos os resultados de anu00e1lise
cacheService.clear('analysis');
```

### Monitoramento de Desempenho
```javascript
// Obter estatu00edsticas de uso do cache
const stats = cacheService.getStats();
console.log(`Taxa de acertos: ${stats.hitRatio}`);
console.log(`Uso de memu00f3ria: ${stats.memoryUsage}`);
console.log(`Itens por categoria:`, stats.categories);
```

## Integrau00e7u00e3o com LangChainEnhancedService

```javascript
// No LangChainEnhancedService
const cacheService = require('./cache.service');

async analyzeExams(planData, exams) {
  // Gerar chave u00fanica baseada nos dados do paciente e exames
  const cacheKey = `exams_${planData.patientName}_${this._generateContentHash(exams)}`;
  
  // Tentar obter resultado do cache
  const cachedResult = cacheService.get(cacheKey);
  if (cachedResult) {
    logger.info('Usando resultado em cache para anu00e1lise de exames');
    return cachedResult;
  }
  
  // Se nu00e3o estiver em cache, executar anu00e1lise
  try {
    // Cu00f3digo para anu00e1lise...
    
    // Armazenar resultado em cache
    cacheService.set(cacheKey, result.text, {
      category: 'analyses',
      ttl: 30 * 24 * 60 * 60 * 1000, // 30 dias
      persist: true
    });
    
    return result.text;
  } catch (error) {
    logger.error(`Erro ao analisar exames: ${error.message}`);
    return 'Nu00e3o foi possu00edvel realizar a anu00e1lise dos exames.';
  }
}

// Mu00e9todo auxiliar para gerar hash do conteu00fado
_generateContentHash(content) {
  const crypto = require('crypto');
  const data = typeof content === 'string' ? content : JSON.stringify(content);
  return crypto.createHash('md5').update(data).digest('hex').substring(0, 10);
}
```

## Considerau00e7u00f5es Tu00e9cnicas

### Configurau00e7u00f5es
- **TTL padru00e3o**: 24 horas (configuru00e1vel globalmente e por item)
- **Intervalo de persistu00eancia**: 30 minutos (ajustu00e1vel conforme necessidade)
- **Localizau00e7u00e3o de persistu00eancia**: `/cache` na raiz do projeto

### Otimizau00e7u00e3o de Memu00f3ria
- Os dados su00e3o armazenados com metadados mu00ednimos para reduzir o consumo de memu00f3ria
- O serviu00e7o fornece estimau00e7u00e3o do uso de memu00f3ria para monitoramento
- TTL por item permite controle granular sobre retenu00e7u00e3o de dados

### Desempenho
- Operau00e7u00f5es su00e3o executadas em memu00f3ria para garantir resposta ru00e1pida
- A persistu00eancia u00e9 assu00edncrona para nu00e3o bloquear operau00e7u00f5es principais
- A estrutura Map garante busca em O(1) para recuperau00e7u00e3o eficiente

### Seguranu00e7a e Recuperau00e7u00e3o
- Persistu00eancia antes do encerramento protege contra perda de dados
- Serializau00e7u00e3o e deserializau00e7u00e3o controladas previnem vulnerabilidades
- Tratamento de erros robusto em todas as operau00e7u00f5es de IO
