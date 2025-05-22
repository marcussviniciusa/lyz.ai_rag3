import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth, AuthContext } from './AuthContext';
import AuthService from '../services/auth.service';

// Mocks
jest.mock('../services/auth.service');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

// Componente de teste para acessar o contexto
const TestComponent = () => {
  const auth = useAuth();
  return (
    <div>
      <div data-testid="loading">{auth.loading.toString()}</div>
      <div data-testid="authenticated">{auth.isAuthenticated.toString()}</div>
      <div data-testid="user">{JSON.stringify(auth.user)}</div>
      <button onClick={() => auth.login('test@example.com', 'password')}>Login</button>
      <button onClick={() => auth.logout()}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should initialize with loading state and check authentication', async () => {
    // Mock das funu00e7u00f5es do AuthService
    AuthService.isAuthenticated.mockReturnValue(false);
    
    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });

    // Verificar o estado inicial
    expect(screen.getByTestId('loading')).toHaveTextContent('false'); // loading deveria ser false apou00f3s a inicializau00e7u00e3o
    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    expect(screen.getByTestId('user')).toHaveTextContent('null');
    
    // Verificar se os mu00e9todos do AuthService foram chamados
    expect(AuthService.isAuthenticated).toHaveBeenCalled();
  });

  it('should load user from localStorage if authenticated', async () => {
    // Mock do usuário autenticado
    const mockUser = { id: '123', name: 'Test User', email: 'test@example.com' };
    
    // Configurar mocks
    AuthService.isAuthenticated.mockReturnValue(true);
    AuthService.getCurrentUser.mockReturnValue(mockUser);
    AuthService.refreshToken.mockResolvedValue({ success: true });
    
    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });

    // Verificar se o usuário foi carregado
    expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    expect(screen.getByTestId('user')).toHaveTextContent(JSON.stringify(mockUser));
    
    // Verificar se os mu00e9todos do AuthService foram chamados
    expect(AuthService.isAuthenticated).toHaveBeenCalled();
    expect(AuthService.getCurrentUser).toHaveBeenCalled();
    expect(AuthService.refreshToken).toHaveBeenCalled();
  });

  it('should handle login successfully', async () => {
    // Mock da resposta de login
    const mockUser = { id: '123', name: 'Test User', email: 'test@example.com' };
    const mockLoginResponse = { 
      success: true,
      message: 'Login realizado com sucesso',
      user: mockUser
    };
    
    // Configurar mocks
    AuthService.login.mockResolvedValue(mockLoginResponse);
    
    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });

    // Simular login
    await act(async () => {
      screen.getByText('Login').click();
    });
    
    // Aguardar atualizau00e7u00e3o do estado
    await waitFor(() => {
      expect(AuthService.login).toHaveBeenCalledWith('test@example.com', 'password');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
      expect(screen.getByTestId('user')).toHaveTextContent(JSON.stringify(mockUser));
    });
  });

  it('should handle login failure', async () => {
    // Mock da resposta de falha no login
    const mockLoginResponse = { 
      success: false,
      message: 'Credenciais invu00e1lidas'
    };
    
    // Configurar mocks
    AuthService.login.mockResolvedValue(mockLoginResponse);
    
    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });

    // Simular login
    await act(async () => {
      screen.getByText('Login').click();
    });
    
    // Verificar que o estado permanece como nu00e3o autenticado
    await waitFor(() => {
      expect(AuthService.login).toHaveBeenCalledWith('test@example.com', 'password');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
      expect(screen.getByTestId('user')).toHaveTextContent('null');
    });
  });

  it('should handle logout', async () => {
    // Mock do usuário autenticado inicialmente
    const mockUser = { id: '123', name: 'Test User', email: 'test@example.com' };
    
    // Renderizar com usuário inicialmente autenticado
    await act(async () => {
      render(
        <AuthContext.Provider value={{ 
          user: mockUser, 
          loading: false,
          isAuthenticated: true,
          login: jest.fn(),
          logout: AuthService.logout,
          register: jest.fn()
        }}>
          <TestComponent />
        </AuthContext.Provider>
      );
    });

    // Verificar estado inicial
    expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    
    // Simular logout
    await act(async () => {
      screen.getByText('Logout').click();
    });
    
    // Verificar que o logout foi chamado
    expect(AuthService.logout).toHaveBeenCalled();
  });
  
  it('should handle token refresh error by logging out', async () => {
    // Configurar mocks
    AuthService.isAuthenticated.mockReturnValue(true);
    AuthService.getCurrentUser.mockReturnValue({ id: '123', name: 'Test User' });
    AuthService.refreshToken.mockRejectedValue(new Error('Token invu00e1lido'));
    
    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });

    // Verificar que o logout foi chamado apou00f3s falha no refresh do token
    await waitFor(() => {
      expect(AuthService.logout).toHaveBeenCalled();
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    });
  });
});
