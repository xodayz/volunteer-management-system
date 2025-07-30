const API_BASE_URL = 'http://localhost:3001/api';

export interface EventoData {
  titulo: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  ubicacion: string;
  tipoEvento?: string;
  capacidadMaxima?: number;
  requisitos?: string;
}

export interface Evento {
  id: number;
  titulo: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  ubicacion: string;
  tipoEvento: string;
  capacidadMaxima?: number;
  requisitos?: string;
  estado: string;
  organizacionNombre: string;
  participantesRegistrados: number;
  createdAt: string;
  updatedAt: string;
}

export interface EventoApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}

class EventoServiceClass {
  private baseUrl = API_BASE_URL;

  private getAuthHeaders() {
    const token = localStorage.getItem('organizacionAuthToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  async createEvento(eventoData: EventoData): Promise<EventoApiResponse> {
    try {
      console.log('🎯 Creando evento:', eventoData);
      
      const response = await fetch(`${this.baseUrl}/eventos`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(eventoData),
      });

      const data = await response.json();
      
      console.log('📦 Respuesta del servidor:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Error creando evento');
      }

      return data;
    } catch (error) {
      console.error('❌ Error creando evento:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error de conexión con el servidor'
      };
    }
  }

  async getEventos(): Promise<EventoApiResponse<{ eventos: Evento[]; total: number }>> {
    try {
      console.log('📋 Obteniendo eventos...');
      
      const response = await fetch(`${this.baseUrl}/eventos`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();
      
      console.log('📦 Eventos obtenidos:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Error obteniendo eventos');
      }

      return data;
    } catch (error) {
      console.error('❌ Error obteniendo eventos:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error de conexión con el servidor'
      };
    }
  }

  async getEventoById(id: number): Promise<EventoApiResponse<{ evento: Evento }>> {
    try {
      console.log(`🔍 Obteniendo evento ${id}...`);
      
      const response = await fetch(`${this.baseUrl}/eventos/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();
      
      console.log('📦 Evento obtenido:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Error obteniendo evento');
      }

      return data;
    } catch (error) {
      console.error('❌ Error obteniendo evento:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error de conexión con el servidor'
      };
    }
  }

  // Método para validar token antes de hacer peticiones
  isAuthenticated(): boolean {
    const token = localStorage.getItem('organizacionAuthToken');
    const organizacion = localStorage.getItem('organizacion');
    return !!(token && organizacion);
  }
}

export const EventoService = new EventoServiceClass();
