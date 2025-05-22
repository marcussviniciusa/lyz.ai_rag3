# Documentau00e7u00e3o do MinioService

## Visu00e3o Geral
O `MinioService` u00e9 um serviu00e7o implementado no frontend da aplicau00e7u00e3o Lyz que atua como interface para comunicau00e7u00e3o com o MinIO (serviu00e7o de armazenamento de objetos) atraveu00e9s das APIs do backend. Ele permite o gerenciamento de arquivos, como upload, obtenu00e7u00e3o de URLs de acesso e exclusu00e3o.

## Funcionalidades Principais

### 1. Upload de Arquivos
Envia arquivos para o servidor MinIO atraveu00e9s do backend.

**Mu00e9todo**: `uploadFile(file, path)`
- **Paru00e2metros**:
  - `file`: Objeto File a ser enviado
  - `path`: (Opcional) Caminho ou categoria para organizar o arquivo
- **Retorno**: Promessa com objeto contendo a chave do arquivo armazenado
- **Implementau00e7u00e3o**: Utiliza FormData e requisiu00e7u00e3o POST com autenticau00e7u00e3o

### 2. Obtenu00e7u00e3o de URLs
Obtm URLs pru00e9-assinadas para visualizau00e7u00e3o segura de arquivos.

**Mu00e9todo**: `getFileUrl(fileKey)`
- **Paru00e2metros**:
  - `fileKey`: Chave u00fanica do arquivo no MinIO
- **Retorno**: Promessa com a URL temporria para acesso ao arquivo
- **Implementau00e7u00e3o**: Requisiu00e7u00e3o GET autenticada, encaminhando a chave do arquivo

### 3. Exclusu00e3o de Arquivos
Remove arquivos do armazenamento MinIO.

**Mu00e9todo**: `deleteFile(fileKey)`
- **Paru00e2metros**:
  - `fileKey`: Chave do arquivo a ser excluido
- **Retorno**: Promessa com o resultado da operau00e7u00e3o
- **Implementau00e7u00e3o**: Requisiu00e7u00e3o DELETE autenticada

### 4. Validau00e7u00e3o de Arquivos
Verifica se arquivos atendem a critrios de tamanho e formato.

**Mu00e9todo**: `validateFile(file, allowedTypes, maxSizeMB)`
- **Paru00e2metros**:
  - `file`: Arquivo a ser validado
  - `allowedTypes`: (Opcional) Array de tipos MIME permitidos
  - `maxSizeMB`: (Opcional) Tamanho mu00e1ximo em MB, padru00e3o 10MB
- **Retorno**: Objeto com resultado da validau00e7u00e3o
  - `valid`: Boolean indicando se o arquivo u00e9 vu00e1lido
  - `error`: Mensagem de erro (se invalid)
- **Implementau00e7u00e3o**: Validau00e7u00e3o client-side para evitar uploads desnecessrios

## Integrau00e7u00e3o com a API

O serviu00e7o se comunica com os seguintes endpoints do backend:

1. **Upload**: `POST /api/files/upload`
   - Corpo: FormData com arquivo e caminho opcional
   - Cabeu00e7alhos: Autenticau00e7u00e3o JWT e Content-Type multipart/form-data

2. **Obter URL**: `GET /api/files/url/:fileKey`
   - Paru00e2metros: fileKey (codificado)
   - Cabeu00e7alhos: Autenticau00e7u00e3o JWT

3. **Excluir**: `DELETE /api/files/:fileKey`
   - Paru00e2metros: fileKey (codificado)
   - Cabeu00e7alhos: Autenticau00e7u00e3o JWT

## Exemplo de Uso

```javascript
// Upload de arquivo
const handleFileUpload = async (file) => {
  try {
    // Validar o arquivo
    const validation = MinioService.validateFile(
      file, 
      ['application/pdf', 'image/jpeg', 'image/png'], // Tipos permitidos
      5 // Tamanho mu00e1ximo (5MB)
    );
    
    if (!validation.valid) {
      alert(validation.error);
      return;
    }
    
    // Realizar upload
    const result = await MinioService.uploadFile(file, 'exams');
    console.log('Arquivo enviado com sucesso:', result.fileKey);
    
    // Obter URL para visualizau00e7u00e3o
    const url = await MinioService.getFileUrl(result.fileKey);
    console.log('URL para acesso:', url);
    
    return result.fileKey;
  } catch (error) {
    console.error('Falha no upload:', error);
  }
};
```

## Tratamento de Erros

O serviu00e7o implementa tratamento de erros para todas as operau00e7u00f5es:

1. **Erros de Upload**:
   - Captura erros da API e retorna mensagens amigveis
   - Registra detalhes do erro no console para depurau00e7u00e3o

2. **Erros de URL**:
   - Gerencia falhas na obtenu00e7u00e3o de URLs pru00e9-assinadas
   - Propaga erros para permitir tratamento no componente

3. **Erros de Exclusu00e3o**:
   - Captura e registra problemas na exclusu00e3o de arquivos
   - Fornece informau00e7u00f5es detalhadas para troubleshooting

## Considerau00e7u00f5es de Segurana

- Todas as requisiu00e7u00f5es incluem token JWT para autenticau00e7u00e3o
- URLs pru00e9-assinadas tu00eam tempo de expirau00e7u00e3o limitado
- Validau00e7u00e3o client-side reduz risco de ataques por upload de arquivos maliciosos
- Encode de parmetros para evitar injeu00e7u00e3o nas requisiu00e7u00f5es
