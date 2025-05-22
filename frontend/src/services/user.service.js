import axios from 'axios';
import authHeader from './auth-header';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Serviço para operações relacionadas a usuários
 */
class UserService {
  /**
   * Obter perfil do usuário atual
   * @returns {Promise} Resposta da API com dados do usuário
   */
  getProfile() {
    return axios.get(`${API_URL}/users/profile/me`, { headers: authHeader() });
  }

  /**
   * Atualizar senha do usuário atual
   * @param {Object} passwordData - Dados para atualização de senha
   * @param {string} passwordData.currentPassword - Senha atual
   * @param {string} passwordData.newPassword - Nova senha
   * @returns {Promise} Resposta da API com resultado da operação
   */
  updatePassword(passwordData) {
    return axios.put(
      `${API_URL}/users/profile/password`,
      passwordData,
      { headers: authHeader() }
    );
  }

  /**
   * Listar todos os usuários (apenas para superadmin)
   * @param {Object} options - Opções de filtragem e paginação
   * @param {number} options.page - Página atual
   * @param {number} options.limit - Limite de itens por página
   * @param {string} options.search - Termo de busca
   * @param {string} options.status - Filtro de status (active/inactive)
   * @param {string} options.company_id - Filtro por empresa
   * @returns {Promise} Resposta da API com lista de usuários
   */
  getUsers(options = {}) {
    const { page, limit, search, status, company_id } = options;
    let url = `${API_URL}/users?`;
    
    if (page) url += `page=${page}&`;
    if (limit) url += `limit=${limit}&`;
    if (search) url += `search=${encodeURIComponent(search)}&`;
    if (status) url += `status=${status}&`;
    if (company_id) url += `company_id=${company_id}`;
    
    return axios.get(url, { headers: authHeader() });
  }

  /**
   * Obter um usuário específico pelo ID
   * @param {string} id - ID do usuário
   * @returns {Promise} Resposta da API com dados do usuário
   */
  getUser(id) {
    return axios.get(`${API_URL}/users/${id}`, { headers: authHeader() });
  }

  /**
   * Criar um novo usuário (apenas superadmin)
   * @param {Object} userData - Dados do novo usuário
   * @returns {Promise} Resposta da API com usuário criado
   */
  createUser(userData) {
    return axios.post(
      `${API_URL}/users`,
      userData,
      { headers: authHeader() }
    );
  }

  /**
   * Atualizar um usuário existente
   * @param {string} id - ID do usuário
   * @param {Object} userData - Dados atualizados do usuário
   * @returns {Promise} Resposta da API com usuário atualizado
   */
  updateUser(id, userData) {
    return axios.put(
      `${API_URL}/users/${id}`,
      userData,
      { headers: authHeader() }
    );
  }

  /**
   * Excluir um usuário
   * @param {string} id - ID do usuário
   * @returns {Promise} Resposta da API com resultado da operação
   */
  deleteUser(id) {
    return axios.delete(
      `${API_URL}/users/${id}`,
      { headers: authHeader() }
    );
  }
  
  /**
   * Obter estatísticas do usuário
   * @returns {Promise} Resposta da API com estatísticas do usuário
   */
  getUserStats() {
    return axios.get(
      `${API_URL}/users/stats`,
      { headers: authHeader() }
    );
  }
}

export default new UserService();
