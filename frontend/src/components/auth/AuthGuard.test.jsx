import React from 'react';
import { screen } from '@testing-library/react';
import { render } from '../../utils/test-utils';
import AuthGuard from './AuthGuard';
import { AuthContext } from '../../context/AuthContext';

// Mock do useLocation e Navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({ pathname: '/protected-route' }),
  Navigate: jest.fn(({ to }) => {
    mockNavigate(to);
    return <div data-testid="navigate">Navigate to {to}</div>;
  })
}));

describe('AuthGuard Component', () => {
  // Setup
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading indicator when authentication is being checked', () => {
    render(
      <AuthContext.Provider value={{ isAuthenticated: false, loading: true }}>
        <AuthGuard>
          <div>Protected Content</div>
        </AuthGuard>
      </AuthContext.Provider>
    );
    
    // Verificar se o indicador de carregamento u00e9 exibido
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should redirect to login page when user is not authenticated', () => {
    render(
      <AuthContext.Provider value={{ isAuthenticated: false, loading: false }}>
        <AuthGuard>
          <div>Protected Content</div>
        </AuthGuard>
      </AuthContext.Provider>
    );
    
    // Verificar se o redirecionamento ocorre
    expect(screen.getByTestId('navigate')).toBeInTheDocument();
    expect(screen.getByText('Navigate to /auth/login')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should render children when user is authenticated', () => {
    render(
      <AuthContext.Provider value={{ isAuthenticated: true, loading: false }}>
        <AuthGuard>
          <div>Protected Content</div>
        </AuthGuard>
      </AuthContext.Provider>
    );
    
    // Verificar se o conteu00fado protegido u00e9 exibido
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });
});
