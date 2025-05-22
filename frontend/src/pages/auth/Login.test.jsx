import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render, mockAuthService, mockFetchResponse } from '../../utils/test-utils';
import Login from './Login';
import { AuthContext } from '../../context/AuthContext';

// Mock do useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Login Component', () => {
  // Setup
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  // Teste de renderizau00e7u00e3o inicial
  it('renders the login form correctly', () => {
    render(<Login />);
    
    // Verificar elementos bou00e1sicos
    expect(screen.getByText('Login - Lyz Healthcare')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
    expect(screen.getByText(/esqueceu a senha/i)).toBeInTheDocument();
    expect(screen.getByText(/Nu00e3o tem uma conta\? Cadastre-se/i)).toBeInTheDocument();
  });

  // Teste de validau00e7u00e3o de formulu00e1rio
  it('handles form validation', async () => {
    const mockLogin = jest.fn();
    
    render(
      <AuthContext.Provider value={{ login: mockLogin }}>
        <Login />
      </AuthContext.Provider>
    );
    
    // Clicar no botu00e3o sem preencher campos
    const submitButton = screen.getByRole('button', { name: /entrar/i });
    fireEvent.click(submitButton);
    
    // Verificar se a funu00e7u00e3o de login nu00e3o foi chamada com campos vazios
    expect(mockLogin).not.toHaveBeenCalled();
  });

  // Teste de login bem-sucedido
  it('handles successful login', async () => {
    const mockLogin = jest.fn().mockResolvedValue({});
    
    render(
      <AuthContext.Provider value={{ login: mockLogin }}>
        <Login />
      </AuthContext.Provider>
    );
    
    // Preencher o formulu00e1rio
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'marcus@lyz.ai' }
    });
    
    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: 'admin123' }
    });
    
    // Enviar o formulu00e1rio
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    
    // Aguardar a chamada ao login e navegau00e7u00e3o
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('marcus@lyz.ai', 'admin123');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  // Teste de login com erro
  it('displays error message on login failure', async () => {
    const mockLogin = jest.fn().mockRejectedValue({
      response: { data: { message: 'Credenciais invu00e1lidas' } }
    });
    
    render(
      <AuthContext.Provider value={{ login: mockLogin }}>
        <Login />
      </AuthContext.Provider>
    );
    
    // Preencher o formulu00e1rio
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'usuario@teste.com' }
    });
    
    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: 'senhaincorreta' }
    });
    
    // Enviar o formulu00e1rio
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    
    // Verificar se a mensagem de erro u00e9 exibida
    await waitFor(() => {
      expect(screen.getByText('Credenciais invu00e1lidas')).toBeInTheDocument();
    });
  });

  // Teste de estado de carregamento
  it('shows loading state during login process', async () => {
    // Criar uma promessa que nu00e3o resolve imediatamente para manter o estado de loading
    let resolveLogin;
    const loginPromise = new Promise(resolve => {
      resolveLogin = resolve;
    });
    
    const mockLogin = jest.fn().mockReturnValue(loginPromise);
    
    render(
      <AuthContext.Provider value={{ login: mockLogin }}>
        <Login />
      </AuthContext.Provider>
    );
    
    // Preencher e enviar o formulu00e1rio
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: 'password123' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    
    // Verificar se o estado de carregamento u00e9 mostrado
    expect(screen.getByRole('button', { name: /entrando/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrando/i })).toBeDisabled();
    
    // Resolver a promessa para concluir o teste
    resolveLogin({});
  });
});
