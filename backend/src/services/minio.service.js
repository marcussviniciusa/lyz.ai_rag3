const Minio = require('minio');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

/**
 * Serviço para gerenciamento de arquivos no MinIO
 */
class MinioService {
  constructor() {
    this.client = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT || 'localhost',
      port: parseInt(process.env.MINIO_PORT || '9000'),
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY
    });

    this.bucketName = process.env.MINIO_BUCKET_NAME || 'lyz-files';
    this.initBucket();
  }

  /**
   * Inicializa o bucket se não existir
   */
  async initBucket() {
    try {
      const exists = await this.client.bucketExists(this.bucketName);
      
      if (!exists) {
        await this.client.makeBucket(this.bucketName);
        logger.info(`Bucket '${this.bucketName}' criado com sucesso`);
      }
    } catch (error) {
      logger.error('Erro ao inicializar bucket MinIO:', error);
    }
  }

  /**
   * Upload de arquivo para o MinIO
   * @param {Object} file - Arquivo a ser enviado (Buffer ou Stream)
   * @param {string} path - Caminho/nome do arquivo (opcional)
   * @returns {Promise<string>} Chave do arquivo armazenado
   */
  async uploadFile(file, path = '') {
    try {
      const fileKey = path || `uploads/${uuidv4()}-${file.originalname}`;
      const metaData = {
        'Content-Type': file.mimetype,
        'X-Amz-Meta-Original-Name': file.originalname
      };

      await this.client.putObject(
        this.bucketName,
        fileKey,
        file.buffer,
        file.size,
        metaData
      );

      logger.info(`Arquivo '${fileKey}' enviado com sucesso para o MinIO`);
      return fileKey;
    } catch (error) {
      logger.error('Erro ao enviar arquivo para o MinIO:', error);
      throw new Error('Erro ao enviar arquivo para o armazenamento');
    }
  }

  /**
   * Obtém URL pré-assinada para acesso ao arquivo
   * @param {string} fileKey - Chave do arquivo
   * @param {number} expirySeconds - Tempo de expiração em segundos
   * @returns {Promise<string>} URL pré-assinada
   */
  async getPresignedUrl(fileKey, expirySeconds = 3600) {
    try {
      const url = await this.client.presignedGetObject(
        this.bucketName,
        fileKey,
        expirySeconds
      );

      return url;
    } catch (error) {
      logger.error(`Erro ao gerar URL para o arquivo '${fileKey}':`, error);
      throw new Error('Erro ao gerar URL para o arquivo');
    }
  }

  /**
   * Exclui um arquivo do MinIO
   * @param {string} fileKey - Chave do arquivo
   * @returns {Promise<boolean>} Resultado da operação
   */
  async deleteFile(fileKey) {
    try {
      await this.client.removeObject(this.bucketName, fileKey);
      logger.info(`Arquivo '${fileKey}' excluído com sucesso do MinIO`);
      return true;
    } catch (error) {
      logger.error(`Erro ao excluir arquivo '${fileKey}':`, error);
      throw new Error('Erro ao excluir arquivo do armazenamento');
    }
  }
}

// Exportar instância única do serviço
module.exports = new MinioService();
