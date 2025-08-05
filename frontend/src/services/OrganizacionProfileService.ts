// Tipos para el perfil de organización
export interface OrganizacionProfile {
  id_organizacion: number;
  nombre: string;
  descripcion?: string;
  nombre_representante: string;
  correo_representante: string;
  telefono_representante?: string;
  direccion?: string;
  sitio_web?: string;
  fecha_registro: string;
  email: string;
  estado: string;
}

export interface UpdateOrganizacionProfileData {
  nombre?: string;
  descripcion?: string;
  nombre_representante?: string;
  correo_representante?: string;
  telefono_representante?: string;
  direccion?: string;
  sitio_web?: string;
}

export interface ChangeOrganizacionPasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{
    msg: string;
    param: string;
    value: any;
  }>;
}

class OrganizacionProfileService {
  private static baseUrl = 'http://localhost:3001/api/organizacion';

  // Obtener token de localStorage
  private static getToken(): string | null {
    return localStorage.getItem('organizacion_token');
  }

  // Headers con autenticación
  private static getHeaders(): HeadersInit {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Obtener perfil de la organización
  static async getProfile(): Promise<ApiResponse<OrganizacionProfile>> {
    try {
      const response = await fetch(`${this.baseUrl}/profile`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error obteniendo perfil de organización:', error);
      throw error;
    }
  }

  // Actualizar perfil de la organización
  static async updateProfile(data: UpdateOrganizacionProfileData): Promise<ApiResponse<OrganizacionProfile>> {
    try {
      const response = await fetch(`${this.baseUrl}/profile`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });

      return await response.json();
    } catch (error) {
      console.error('Error actualizando perfil de organización:', error);
      throw error;
    }
  }

  // Cambiar contraseña
  static async changePassword(data: ChangeOrganizacionPasswordData): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/change-password`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });

      return await response.json();
    } catch (error) {
      console.error('Error cambiando contraseña de organización:', error);
      throw error;
    }
  }

  // Verificar contraseña actual
  static async verifyCurrentPassword(password: string): Promise<ApiResponse<{ isValid: boolean }>> {
    try {
      const response = await fetch(`${this.baseUrl}/verify-password`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ password })
      });

      return await response.json();
    } catch (error) {
      console.error('Error verificando contraseña de organización:', error);
      throw error;
    }
  }
}

export default OrganizacionProfileService;
