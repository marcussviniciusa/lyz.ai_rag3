# Serviço de Retry Automático

## Visão Geral
O `RetryService` fornece funcionalidades para lidar com falhas temporárias em requisições e operações assíncronas através de mecanismos de retry automático. Este serviço é especialmente útil para melhorar a resiliência da aplicação Lyz Healthcare em ambientes com conectividade instável ou quando os serviços backend estão sobrecarregados.

## Funcionalidades Principais

### Retry Genérico para Operações Assíncronas
- Implementa backoff exponencial para evitar sobrecarga do servidor
- Adiciona jitter (variação aleatória) para prevenir sincronização de requisições
- Permite configuração flexível do número de tentativas e intervalos
- Suporta callbacks para notificação e logging durante retentativas

### Retry Específico para Requisições HTTP
- Identifica automaticamente erros HTTP que merecem nova tentativa
- Trata diferentes tipos de falhas de rede e erros de servidor
- Integra-se facilmente com os serviços existentes que usam Axios

## Métodos Principais

### `retry(asyncFn, options)`
Executa uma função assíncrona com retry automático em caso de falha.

**Parâmetros:**
- `asyncFn` (Function): Função assíncrona a ser executada
- `options` (Object): Configurações de retry
  - `maxRetries` (number): Número máximo de tentativas (default: 3)
  - `baseDelay` (number): Atraso base em ms entre tentativas (default: 1000)
  - `exponential` (boolean): Se o atraso deve aumentar exponencialmente (default: true)
  - `onRetry` (Function): Callback chamado antes de cada nova tentativa
  - `shouldRetry` (Function): Função que determina se deve tentar novamente com base no erro

**Retorno:**
- `Promise`: Resolução com o resultado da função ou rejeição após todas as tentativas

### `shouldRetryHttpRequest(error)`
Função auxiliar para determinar se uma requisição HTTP deve ser repetida com base no erro.

**Parâmetros:**
- `error` (Error): Erro da requisição HTTP

**Retorno:**
- `boolean`: Verdadeiro se deve tentar novamente, falso caso contrário

### `httpRequestWithRetry(requestFn, retryOptions)`
Wrapper para requisições HTTP com retry automático.

**Parâmetros:**
- `requestFn` (Function): Função que faz a requisição HTTP
- `retryOptions` (Object): Opções específicas para o retry

**Retorno:**
- `Promise`: Resolução com a resposta da requisição ou rejeição após tentativas

## Exemplo de Uso

### Retry para Operação Genérica
```javascript
import retryService from '../services/retry.service';

// Função que pode falhar
const fetchData = async () => {
  // Alguma operação que pode falhar
  return await api.getData();
};

// Executar com retry
try {
  const result = await retryService.retry(fetchData, {
    maxRetries: 5,
    baseDelay: 2000,
    onRetry: (attempt, max, error) => {
      console.log(`Tentativa ${attempt} de ${max} falhou. Tentando novamente...`);
    }
  });
  console.log('Operação bem-sucedida:', result);
} catch (error) {
  console.error('Todas as tentativas falharam:', error);
}
```

### Retry para Requisição HTTP
```javascript
import retryService from '../services/retry.service';

// Buscar dados de um usuário com retry automático
try {
  const userData = await retryService.httpRequestWithRetry(
    () => axios.get(`/api/users/${userId}`),
    {
      maxRetries: 3,
      onRetry: (attempt) => {
        notificationService.notify(
          `Falha na conexão. Tentativa ${attempt} de 3...`,
          'warning'
        );
      }
    }
  );
  // Processar dados do usuário
} catch (error) {
  // Tratar falha após todas as tentativas
  notificationService.notifyError('Não foi possível obter dados do usuário');
}
```

## Considerações Técnicas

### Backoff Exponencial
O serviço implementa backoff exponencial, uma técnica onde o tempo entre tentativas aumenta exponencialmente, reduzindo a carga no servidor e aumentando a probabilidade de sucesso em tentativas subsequentes.

### Jitter
A adição de jitter (variação aleatória) nos intervalos de retry previne o problema de sincronização onde múltiplos clientes tentam reconectar-se exatamente ao mesmo tempo após uma falha do servidor.

### Tipos de Erros para Retry
Por padrão, o serviço tenta novamente para os seguintes códigos HTTP:
- 408: Request Timeout
- 429: Too Many Requests
- 500: Internal Server Error
- 502: Bad Gateway
- 503: Service Unavailable
- 504: Gateway Timeout

Além disso, falhas de rede (como desconexão) também disparam o mecanismo de retry.
