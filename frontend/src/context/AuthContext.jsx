import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/auth.service';

// Criando o contexto de autenticau00e7u00e3o
const AuthContext = createContext(null);

/**
 * Hook personalizado para facilitar o acesso ao contexto de autenticau00e7u00e3o
 * @returns {Object} Contexto de autenticau00e7u00e3o
 */
export const useAuth = () => useContext(AuthContext);

/**
 * Provider para o contexto de autenticau00e7u00e3o
 * Gerencia estado de login, tokens e informau00e7u00f5es do usuu00e1rio
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Carregar usuu00e1rio do localStorage ao montar o componente
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      try {
        // Verificar se existe um token
        if (AuthService.isAuthenticated()) {
          // Recuperar dados do usuu00e1rio do localStorage
          const userData = AuthService.getCurrentUser();
          setUser(userData);
          
          // Verificar se o token ainda u00e9 vu00e1lido e atualizu00e1-lo se necessário
          try {
            await AuthService.refreshToken();
          } catch (error) {
            // Se o refresh token for invu00e1lido, fazer logout
            handleLogout();
            return;
          }
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticau00e7u00e3o:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Realiza login do usuu00e1rio
   * @param {string} email - Email do usuu00e1rio 
   * @param {string} password - Senha do usuu00e1rio
   * @returns {Promise} Resultado do login
   */
  const handleLogin = async (email, password) => {
    try {
      setLoading(true);
      const response = await AuthService.login(email, password);
      
      if (response.success) {
        setUser(response.user);
        return { success: true };
      }
      
      return { success: false, message: response.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Erro ao realizar login' 
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Realiza logout do usuu00e1rio
   */
  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
    navigate('/auth/login');
  };

  /**
   * Registra um novo usuu00e1rio
   * @param {Object} userData - Dados do usuu00e1rio 
   * @returns {Promise} Resultado do registro
   */
  const handleRegister = async (userData) => {
    try {
      setLoading(true);
      const response = await AuthService.register(userData);
      
      if (response.success) {
        setUser(response.user);
        return { success: true };
      }
      
      return { success: false, message: response.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Erro ao registrar usuu00e1rio' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Valor do contexto
  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
