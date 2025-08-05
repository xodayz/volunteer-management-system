// UserService.ts - Servicios para gestión de perfil de usuario
const API_BASE_URL = 'http://localhost:3001/api';

interface UserProfile {
  id_usuario: number;
  username: string;
  nombre: string;
  correo: string;
  telefono: string;
  direccion: string;
  interes_habilidades: string[];
  created_at: string;
}

interface UpdateProfileData {
  nombre?: string;
  telefono?: string;
  direccion?: string;
  interes_habilidades?: string[];
}

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export class UserService {
  private static getAuthToken(): string | null {
    return localStorage.getItem('token');
  }

  private static getAuthHeaders(): HeadersInit {
    const token = this.getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  /**
   * Obtener perfil del usuario autenticado
   */
  static async getUserProfile(): Promise<ApiResponse<UserProfile>> {
    try {
      console.log('🔍 UserService: Obteniendo perfil del usuario');
      
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ UserService: Error obteniendo perfil:', data.message);
        throw new Error(data.message || 'Error obteniendo perfil');
      }

      console.log('✅ UserService: Perfil obtenido exitosamente');
      return data;
    } catch (error) {
      console.error('💥 UserService: Error en getUserProfile:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  /**
   * Actualizar perfil del usuario
   */
  static async updateProfile(profileData: UpdateProfileData): Promise<ApiResponse<UserProfile>> {
    try {
      console.log('🔄 UserService: Actualizando perfil:', profileData);
      
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ UserService: Error actualizando perfil:', data.message);
        throw new Error(data.message || 'Error actualizando perfil');
      }

      console.log('✅ UserService: Perfil actualizado exitosamente');
      return data;
    } catch (error) {
      console.error('💥 UserService: Error en updateProfile:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  /**
   * Verificar contraseña actual del usuario
   */
  static async verifyCurrentPassword(currentPassword: string): Promise<ApiResponse> {
    try {
      console.log('🔐 UserService: Verificando contraseña actual');
      
      const response = await fetch(`${API_BASE_URL}/password/verify`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ currentPassword })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ UserService: Error verificando contraseña:', data.message);
        throw new Error(data.message || 'Error verificando contraseña');
      }

      console.log('✅ UserService: Contraseña verificada exitosamente');
      return data;
    } catch (error) {
      console.error('💥 UserService: Error en verifyCurrentPassword:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  /**
   * Cambiar contraseña del usuario
   */
  static async changePassword(passwordData: PasswordChangeData): Promise<ApiResponse> {
    try {
      console.log('🔄 UserService: Cambiando contraseña');
      
      // Validación en el frontend antes de enviar
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        return {
          success: false,
          message: 'Las contraseñas no coinciden'
        };
      }

      const response = await fetch(`${API_BASE_URL}/password/change`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ UserService: Error cambiando contraseña:', data.message);
        throw new Error(data.message || 'Error cambiando contraseña');
      }

      console.log('✅ UserService: Contraseña cambiada exitosamente');
      return data;
    } catch (error) {
      console.error('💥 UserService: Error en changePassword:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  /**
   * Validar formato de contraseña
   */
  static validatePasswordFormat(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Mínimo 6 caracteres
    if (password.length < 6) {
      errors.push('Debe tener al menos 6 caracteres');
    }

    // Al menos una mayúscula
    if (!/[A-Z]/.test(password)) {
      errors.push('Debe contener al menos una letra mayúscula');
    }

    // Al menos una minúscula
    if (!/[a-z]/.test(password)) {
      errors.push('Debe contener al menos una letra minúscula');
    }

    // Al menos un número
    if (!/\d/.test(password)) {
      errors.push('Debe contener al menos un número');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
