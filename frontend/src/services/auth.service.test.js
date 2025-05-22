import axios from 'axios';
import AuthService from './auth.service';

// Mock do axios
jest.mock('axios');

describe('AuthService', () => {
  // Setup e cleanup
  beforeEach(() => {
    localStorage.clear();
    jest.resetAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('login', () => {
    it('should login successfully and store tokens', async () => {
      // Dados de teste
      const mockUser = {
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
        company: {
          id: '456',
          name: 'Test Company'
        }
      };
      
      const mockResponse = {
        data: {
          success: true,
          message: 'Login realizado com sucesso',
          user: mockUser,
          tokens: {
            access: 'mock-access-token',
            refresh: 'mock-refresh-token'
          }
        }
      };

      // Mock da resposta do axios
      axios.post.mockResolvedValueOnce(mockResponse);

      // Executar o login
      const result = await AuthService.login('test@example.com', 'password123');

      // Verificar se o axios foi chamado corretamente
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        { email: 'test@example.com', password: 'password123' }
      );

      // Verificar se os tokens foram armazenados no localStorage
      expect(localStorage.getItem('accessToken')).toBe('mock-access-token');
      expect(localStorage.getItem('refreshToken')).toBe('mock-refresh-token');
      expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));

      // Verificar o resultado retornado
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle login failure', async () => {
      // Mock de erro
      const errorResponse = {
        response: {
          data: {
            success: false,
            message: 'Credenciais invu00e1lidas'
          },
          status: 401
        }
      };

      // Mock da resposta de erro do axios
      axios.post.mockRejectedValueOnce(errorResponse);

      // Executar o login e esperar erro
      await expect(AuthService.login('test@example.com', 'wrong-password'))
        .rejects
        .toEqual({ success: false, message: 'Credenciais invu00e1lidas' });

      // Verificar se nada foi armazenado no localStorage
      expect(localStorage.getItem('accessToken')).toBeNull();
      expect(localStorage.getItem('refreshToken')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      // Configurar localStorage com refresh token
      localStorage.setItem('refreshToken', 'old-refresh-token');

      // Mock da resposta do axios
      const mockResponse = {
        data: {
          success: true,
          accessToken: 'new-access-token'
        }
      };

      axios.post.mockResolvedValueOnce(mockResponse);

      // Executar refresh token
      const result = await AuthService.refreshToken();

      // Verificar se o axios foi chamado corretamente
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/auth/refresh-token'),
        { refreshToken: 'old-refresh-token' }
      );

      // Verificar se o novo access token foi armazenado
      expect(localStorage.getItem('accessToken')).toBe('new-access-token');
      
      // Verificar o resultado retornado
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle missing refresh token', async () => {
      // Testar sem refresh token no localStorage
      await expect(AuthService.refreshToken())
        .rejects
        .toThrow('Refresh token nu00e3o encontrado');
    });

    it('should call logout on 401 response', async () => {
      // Espionar o mu00e9todo logout
      const logoutSpy = jest.spyOn(AuthService, 'logout');
      
      // Configurar localStorage
      localStorage.setItem('refreshToken', 'invalid-refresh-token');

      // Mock de erro 401
      const errorResponse = {
        response: {
          data: {
            success: false,
            message: 'Token de refresh invu00e1lido'
          },
          status: 401
        }
      };

      axios.post.mockRejectedValueOnce(errorResponse);

      // Executar refresh token e esperar erro
      await expect(AuthService.refreshToken())
        .rejects
        .toEqual({ success: false, message: 'Token de refresh invu00e1lido' });

      // Verificar se logout foi chamado
      expect(logoutSpy).toHaveBeenCalled();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when accessToken exists', () => {
      localStorage.setItem('accessToken', 'valid-token');
      expect(AuthService.isAuthenticated()).toBe(true);
    });

    it('should return false when accessToken does not exist', () => {
      expect(AuthService.isAuthenticated()).toBe(false);
    });
  });

  describe('getCurrentUser', () => {
    it('should return user when user exists in localStorage', () => {
      const mockUser = { id: '123', name: 'Test User' };
      localStorage.setItem('user', JSON.stringify(mockUser));

      expect(AuthService.getCurrentUser()).toEqual(mockUser);
    });

    it('should return null when user does not exist in localStorage', () => {
      expect(AuthService.getCurrentUser()).toBeNull();
    });
  });
});
