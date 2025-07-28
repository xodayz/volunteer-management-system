const API_BASE_URL = 'http://localhost:3001/api';

export interface OrganizacionLoginData {
  email: string;
  password: string;
}

export interface OrganizacionRegisterData {
  nombreOrganizacion: string;
  nombreRepresentante: string;
  correoRepresentante: string;
  password: string;
  telefono: string;
  sitioWeb?: string;
  descripcion: string;
  direccion: string;
}

export interface OrganizacionApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
  organizacion?: any;
  token?: string;
}

class OrganizacionAuthServiceClass {
  private baseUrl = API_BASE_URL;

  async login(loginData: OrganizacionLoginData): Promise<OrganizacionApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/organizacion/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      
      if (data.success && data.token) {
        localStorage.setItem('organizacionAuthToken', data.token);
        localStorage.setItem('organizacion', JSON.stringify(data.data.organizacion));
      }

      return data;
    } catch (error) {
      console.error('Error en login de organización:', error);
      return {
        success: false,
        message: 'Error de conexión con el servidor'
      };
    }
  }

  async register(registerData: OrganizacionRegisterData): Promise<OrganizacionApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/organizacion/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();
      
      if (data.success && data.token) {
        localStorage.setItem('organizacionAuthToken', data.token);
        localStorage.setItem('organizacion', JSON.stringify(data.data.organizacion));
      }

      return data;
    } catch (error) {
      console.error('Error en registro de organización:', error);
      return {
        success: false,
        message: 'Error de conexión con el servidor'
      };
    }
  }

  async getProfile(): Promise<OrganizacionApiResponse> {
    try {
      const token = localStorage.getItem('organizacionAuthToken');
      
      if (!token) {
        return {
          success: false,
          message: 'No hay token de autenticación'
        };
      }

      const response = await fetch(`${this.baseUrl}/organizacion/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      return {
        success: false,
        message: 'Error de conexión con el servidor'
      };
    }
  }

  async logout(): Promise<void> {
    try {
      const token = localStorage.getItem('organizacionAuthToken');
      
      if (token) {
        await fetch(`${this.baseUrl}/organizacion/logout`, {
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
      localStorage.removeItem('organizacionAuthToken');
      localStorage.removeItem('organizacion');
    }
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('organizacionAuthToken');
    return !!token;
  }

  getToken(): string | null {
    return localStorage.getItem('organizacionAuthToken');
  }

  getOrganizacion(): any | null {
    const organizacionData = localStorage.getItem('organizacion');
    return organizacionData ? JSON.parse(organizacionData) : null;
  }

  async verifyToken(): Promise<OrganizacionApiResponse> {
    try {
      const token = localStorage.getItem('organizacionAuthToken');
      
      if (!token) {
        return {
          success: false,
          message: 'No hay token de autenticación'
        };
      }

      const response = await fetch(`${this.baseUrl}/organizacion/verify-token`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!data.success) {
        this.logout();
      }

      return data;
    } catch (error) {
      console.error('Error verificando token:', error);
      this.logout();
      return {
        success: false,
        message: 'Error de conexión con el servidor'
      };
    }
  }
}

export const OrganizacionAuthService = new OrganizacionAuthServiceClass();
