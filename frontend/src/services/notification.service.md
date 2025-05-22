# Serviu00e7o de Notificau00e7u00e3o e Progresso

## Visu00e3o Geral
O `NotificationService` u00e9 um serviu00e7o centralizado que fornece mecanismos para gerenciar notificau00e7u00f5es, atualizações de progresso e mensagens de erro na aplicau00e7u00e3o Lyz Healthcare. Utilizando a arquitetura de observadores (Observables) do RxJS, este serviu00e7o permite que diferentes componentes da aplicau00e7u00e3o se inscrevam para receber atualizações de estado sem acoplamento direto.

## Funcionalidades Principais

### Gerenciamento de Progresso
- Acompanha o progresso de operau00e7u00f5es assu00edncronas longas (como gerau00e7u00e3o de planos)
- Fornece informau00e7u00f5es sobre o estu00e1gio atual, percentual concluu00eddo e mensagens descritivas
- Permite iniciar rastreamento com estu00e1gios predefinidos para operau00e7u00f5es complexas

### Sistema de Notificau00e7u00f5es
- Envia mensagens informativas, de sucesso, alerta ou erro para o usuu00e1rio
- Permite personalizau00e7u00e3o do tipo e conteu00fado das notificau00e7u00f5es
- Registra automaticamente o timestamp das notificau00e7u00f5es

### Tratamento de Erros
- Centraliza o registro e notificau00e7u00e3o de erros na aplicau00e7u00e3o
- Vincula erros a operau00e7u00f5es especu00edficas quando aplicu00e1vel
- Facilita o debug e a experiu00eancia do usuu00e1rio durante falhas

## Mu00e9todos Principais

### `updateProgress(operationId, percentComplete, message, data)`
Atualiza o progresso de uma operau00e7u00e3o assu00edncrona com identificau00e7u00e3o, percentual e mensagem.

### `startProgressTracking(operationId, stages, title)`
Inicia o rastreamento de progresso para uma operau00e7u00e3o complexa com mu00faltiplos estu00e1gios, retornando um controlador para atualizau00e7u00f5es.

### `completeProgress(operationId, message)`
Marca uma operau00e7u00e3o como concluu00edda, notificando todos os observadores.

### `notify(message, type, data)`
Envia uma notificau00e7u00e3o genu00e9rica para o usuu00e1rio com tipo especificado (info, success, warning, error).

### `notifyError(message, error, operationId)`
Registra e notifica um erro, opcionalmente associando-o a uma operau00e7u00e3o especu00edfica.

## Observables Expostos

### `progress$`
Observable para inscrever-se em atualizações de progresso de qualquer operau00e7u00e3o.

### `notification$`
Observable para inscrever-se em notificau00e7u00f5es gerais da aplicau00e7u00e3o.

### `error$`
Observable para inscrever-se em notificau00e7u00f5es de erro especu00edficas.

## Exemplo de Uso

### Rastreamento de uma Operau00e7u00e3o Complexa
```javascript
// Iniciar rastreamento de progresso para gerau00e7u00e3o de plano
const progressTracker = notificationService.startProgressTracking(
  'generate-plan-123',
  ['Processando dados do paciente', 'Analisando exames', 'Analisando MTC', 'Analisando matriz IFM', 'Gerando recomendau00e7u00f5es'],
  'Gerando plano de sau00fade'
);

// Avanu00e7ar para o pru00f3ximo estu00e1gio
progress.nextStage('Iniciando anu00e1lise de exames...');

// Atualizar o estu00e1gio atual sem avanu00e7ar
progress.updateStage('Processando resultado do hemograma...', 42);

// Completar a operau00e7u00e3o
progress.complete('Plano de sau00fade gerado com sucesso!');

// Reportar erro na operau00e7u00e3o
progress.error('Falha ao gerar plano: erro de conexu00e3o com o serviu00e7o LangChain');
```

### Inscriu00e7u00e3o para Receber Notificau00e7u00f5es
```javascript
// Em um componente React
useEffect(() => {
  const notificationSubscription = notificationService.notification$.subscribe(notification => {
    // Exibir notificau00e7u00e3o ao usuu00e1rio (ex: usando Snackbar)
    showSnackbar(notification.message, notification.type);
  });
  
  return () => {
    notificationSubscription.unsubscribe();
  };
}, []);
```

## Considerau00e7u00f5es Tu00e9cnicas

### Arquitetura Baseada em Observables
O serviu00e7o utiliza o padru00e3o Observable do RxJS para implementar o modelo Publisher-Subscriber, permitindo comunicau00e7u00e3o assíncrona e desacoplada entre diferentes partes da aplicau00e7u00e3o.

### Instu00e2ncia u00danica (Singleton)
O serviu00e7o u00e9 implementado como um singleton para garantir que haja apenas uma instu00e2ncia em toda a aplicau00e7u00e3o, centralizando o gerenciamento de notificau00e7u00f5es.

### Desacoplamento
Componentes podem se inscrever e cancelar inscriu00e7u00f5es independentemente, reduzindo o acoplamento e facilitando testes.
