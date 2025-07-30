const API_BASE_URL = 'http://localhost:3001/api';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  nombre: string;
  correo: string;
  password: string;
  telefono?: string;
  fecha_nacimiento?: string;
  direccion?: string;
  interes_habilidades?: string[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
  user?: any;
  token?: string;
}

class AuthServiceClass {
  private baseUrl = API_BASE_URL;

  async login(loginData: LoginData): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      
      if (data.success && data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error('Error en login:', error);
      return {
        success: false,
        message: 'Error de conexión con el servidor',
      };
    }
  }

  async register(registerData: RegisterData): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();
      
      if (data.success && data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error('Error en registro:', error);
      return {
        success: false,
        message: 'Error de conexión con el servidor',
      };
    }
  }

  async verifyToken(): Promise<ApiResponse> {
    try {
      const token = this.getToken();
      if (!token) {
        return {
          success: false,
          message: 'No hay token de autenticación',
        };
      }

      const response = await fetch(`${this.baseUrl}/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success && data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error('Error verificando token:', error);
      return {
        success: false,
        message: 'Error de conexión con el servidor',
      };
    }
  }

  async logout(): Promise<void> {
    try {
      const token = this.getToken();
      if (token) {
        await fetch(`${this.baseUrl}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getUser(): any | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/test`, {
        method: 'GET',
      });
      return response.ok;
    } catch (error) {
      console.error('Error testing connection:', error);
      return false;
    }
  }
}

export const AuthService = new AuthServiceClass();
