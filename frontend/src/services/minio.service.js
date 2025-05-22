import axios from 'axios';
import authHeader from './auth-header';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Serviço para interação com o MinIO através do backend
 */
class MinioService {
  /**
   * Realiza o upload de um arquivo para o MinIO
   * @param {File} file - Arquivo a ser enviado
   * @param {string} path - Caminho/categoria do arquivo (opcional)
   * @returns {Promise<Object>} Resposta com a chave do arquivo armazenado
   */
  async uploadFile(file, path = '') {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      if (path) {
        formData.append('path', path);
      }
      
      const response = await axios.post(
        `${API_URL}/files/upload`,
        formData,
        {
          headers: {
            ...authHeader(),
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Erro ao enviar arquivo:', error);
      throw new Error(error.response?.data?.message || 'Erro ao enviar arquivo');
    }
  }

  /**
   * Obtém uma URL pré-assinada para visualização de um arquivo
   * @param {string} fileKey - Chave do arquivo no MinIO
   * @returns {Promise<string>} URL pré-assinada
   */
  async getFileUrl(fileKey) {
    try {
      const response = await axios.get(
        `${API_URL}/files/url/${encodeURIComponent(fileKey)}`,
        { headers: authHeader() }
      );
      
      return response.data.url;
    } catch (error) {
      console.error('Erro ao obter URL do arquivo:', error);
      throw new Error(error.response?.data?.message || 'Erro ao obter URL do arquivo');
    }
  }

  /**
   * Exclui um arquivo do MinIO
   * @param {string} fileKey - Chave do arquivo a ser excluído
   * @returns {Promise<Object>} Resposta da operação
   */
  async deleteFile(fileKey) {
    try {
      const response = await axios.delete(
        `${API_URL}/files/${encodeURIComponent(fileKey)}`,
        { headers: authHeader() }
      );
      
      return response.data;
    } catch (error) {
      console.error('Erro ao excluir arquivo:', error);
      throw new Error(error.response?.data?.message || 'Erro ao excluir arquivo');
    }
  }

  /**
   * Valida se um arquivo é de um formato permitido
   * @param {File} file - Arquivo a ser validado
   * @param {Array<string>} allowedTypes - Tipos MIME permitidos
   * @param {number} maxSizeMB - Tamanho máximo em MB
   * @returns {Object} Resultado da validação
   */
  validateFile(file, allowedTypes = [], maxSizeMB = 10) {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    
    // Verificar tamanho
    if (file.size > maxSizeBytes) {
      return {
        valid: false,
        error: `O arquivo excede o tamanho máximo de ${maxSizeMB}MB`
      };
    }
    
    // Verificar tipo, se especificado
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Tipo de arquivo não permitido. Tipos aceitos: ${allowedTypes.join(', ')}`
      };
    }
    
    return { valid: true };
  }
}

export default new MinioService();
