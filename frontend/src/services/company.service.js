import axios from 'axios';
import authHeader from './auth-header';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Serviço para operações relacionadas a empresas
 */
class CompanyService {
  /**
   * Obter lista de empresas com filtros e paginação
   * @param {Object} options - Opções de filtragem e paginação
   * @param {number} options.page - Página atual
   * @param {number} options.limit - Limite de itens por página
   * @param {string} options.search - Termo de busca
   * @param {string} options.status - Filtro de status da empresa
   * @returns {Promise} Resposta da API com lista de empresas
   */
  getCompanies(options = {}) {
    const { page, limit, search, status } = options;
    let url = `${API_URL}/companies?`;
    
    if (page) url += `page=${page}&`;
    if (limit) url += `limit=${limit}&`;
    if (search) url += `search=${encodeURIComponent(search)}&`;
    if (status) url += `status=${status}`;
    
    return axios.get(url, { headers: authHeader() });
  }

  /**
   * Obter uma empresa específica pelo ID
   * @param {string} id - ID da empresa
   * @returns {Promise} Resposta da API com dados da empresa
   */
  getCompany(id) {
    return axios.get(`${API_URL}/companies/${id}`, { headers: authHeader() });
  }

  /**
   * Criar uma nova empresa
   * @param {Object} companyData - Dados da nova empresa
   * @returns {Promise} Resposta da API com empresa criada
   */
  createCompany(companyData) {
    return axios.post(
      `${API_URL}/companies`,
      companyData,
      { headers: authHeader() }
    );
  }

  /**
   * Atualizar uma empresa existente
   * @param {string} id - ID da empresa
   * @param {Object} companyData - Dados atualizados da empresa
   * @returns {Promise} Resposta da API com empresa atualizada
   */
  updateCompany(id, companyData) {
    return axios.put(
      `${API_URL}/companies/${id}`,
      companyData,
      { headers: authHeader() }
    );
  }

  /**
   * Excluir uma empresa
   * @param {string} id - ID da empresa
   * @returns {Promise} Resposta da API com resultado da operação
   */
  deleteCompany(id) {
    return axios.delete(
      `${API_URL}/companies/${id}`,
      { headers: authHeader() }
    );
  }
  
  /**
   * Obter estatísticas da empresa
   * @param {string} id - ID da empresa
   * @returns {Promise} Resposta da API com estatísticas da empresa
   */
  getCompanyStats(id) {
    return axios.get(
      `${API_URL}/companies/${id}/stats`,
      { headers: authHeader() }
    );
  }
  
  /**
   * Atualizar limite de tokens de uma empresa
   * @param {string} id - ID da empresa
   * @param {number} tokenLimit - Novo limite de tokens
   * @returns {Promise} Resposta da API com resultado da operação
   */
  updateTokenLimit(id, tokenLimit) {
    return axios.put(
      `${API_URL}/companies/${id}/tokens`,
      { token_limit: tokenLimit },
      { headers: authHeader() }
    );
  }
}

export default new CompanyService();
