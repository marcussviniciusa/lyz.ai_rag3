import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Serviu00e7o para autenticau00e7u00e3o e integrau00e7u00e3o com Curseduca
 */
const AuthService = {
  /**
   * Valida o email do usuu00e1rio com o Curseduca
   * @param {string} email - Email a ser validado
   * @returns {Promise<Object>} Resultado da validau00e7u00e3o
   */
  validateEmail: async (email) => {
    try {
      const response = await axios.post(`${API_URL}/auth/validate-email`, { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Erro ao validar email' };
    }
  },

  /**
   * Registra um novo usuu00e1rio
   * @param {Object} userData - Dados do usuu00e1rio
   * @returns {Promise<Object>} Resultado do registro
   */
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      
      // Salvar tokens no localStorage
      if (response.data.success && response.data.tokens) {
        localStorage.setItem('accessToken', response.data.tokens.access);
        localStorage.setItem('refreshToken', response.data.tokens.refresh);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Erro ao registrar usuu00e1rio' };
    }
  },

  /**
   * Realiza login do usuu00e1rio
   * @param {string} email - Email do usuu00e1rio
   * @param {string} password - Senha do usuu00e1rio
   * @returns {Promise<Object>} Resultado do login
   */
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      
      // Salvar tokens no localStorage
      if (response.data.success && response.data.tokens) {
        localStorage.setItem('accessToken', response.data.tokens.access);
        localStorage.setItem('refreshToken', response.data.tokens.refresh);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Erro ao realizar login' };
    }
  },

  /**
   * Atualiza o token de acesso usando o refresh token
   * @returns {Promise<Object>} Novo token de acesso
   */
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        throw new Error('Refresh token nu00e3o encontrado');
      }
      
      const response = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });
      
      if (response.data.success && response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
      }
      
      return response.data;
    } catch (error) {
      // Se o refresh token estiver invu00e1lido, fazer logout
      if (error.response?.status === 401) {
        AuthService.logout();
      }
      throw error.response?.data || { success: false, message: 'Erro ao atualizar token' };
    }
  },

  /**
   * Realiza logout do usuu00e1rio
   */
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    // Redirecionar para a pu00e1gina de login
    window.location.href = '/auth/login';
  },

  /**
   * Verifica se o usuu00e1rio estu00e1 autenticado
   * @returns {boolean} True se o usuu00e1rio estiver autenticado
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  },

  /**
   * Obtém o usuu00e1rio atual
   * @returns {Object|null} Dados do usuu00e1rio ou null se nu00e3o estiver autenticado
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Obtém o token de acesso
   * @returns {string|null} Token de acesso ou null se nu00e3o existir
   */
  getAccessToken: () => {
    return localStorage.getItem('accessToken');
  }
};

export default AuthService;
