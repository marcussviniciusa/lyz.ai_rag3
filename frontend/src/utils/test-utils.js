import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';
import { AuthProvider } from '../context/AuthContext';

/**
 * Utilitu00e1rio para renderizar componentes com os providers necessários nos testes
 * @param {JSX.Element} ui - Componente React a ser renderizado
 * @param {Object} options - Opu00e7u00f5es adicionais para a renderizau00e7u00e3o
 * @returns {Object} - Resultado da renderizau00e7u00e3o com mu00e9todos adicionais
 */
const renderWithProviders = (ui, options = {}) => {
  const {
    initialAuthState = {
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null
    },
    ...renderOptions
  } = options;

  const Wrapper = ({ children }) => (
    <ThemeProvider theme={theme}>
      <AuthProvider initialState={initialAuthState}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Re-exporta tudo de React Testing Library
export * from '@testing-library/react';

// Sobrescreve o mu00e9todo render para usar nosso renderWithProviders
export { renderWithProviders as render };

/**
 * Mock para o serviu00e7o de autenticau00e7u00e3o usado nos testes
 */
export const mockAuthService = {
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
  validateEmail: jest.fn(),
  refreshToken: jest.fn(),
  getCurrentUser: jest.fn(() => JSON.parse(localStorage.getItem('user'))),
  isAuthenticated: jest.fn(() => !!localStorage.getItem('accessToken'))
};

/**
 * Configura resposta para mock de fetch API
 * @param {Object} data - Dados para retornar na resposta
 * @param {Number} status - Cu00f3digo de status HTTP
 * @returns {Object} - Mock de resposta de fetch
 */
export const mockFetchResponse = (data, status = 200) => {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: jest.fn().mockResolvedValue(data)
  };
};
