export interface EventData {
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  horaInicio: string;
  horaFin: string;
  direccion: string;
  idCategoria: number;
  capacidadMaxima: number;
  requisitos: string[];
}

export interface Event {
  id_evento: number;
  nombre: string;
  descripcion: string;
  id_organizacion: number;
  fecha_inicio: string;
  fecha_fin: string;
  hora_inicio: string;
  hora_fin: string;
  direccion: string;
  id_categoria: number;
  capacidad_maxima: number;
  voluntarios_inscritos: number;
  requisitos: string[];
  estado_evento: string;
  created_at: string;
  updated_at: string;
  categoria_nombre?: string;
}

export interface Categoria {
  id_categoria: number;
  nombre: string;
  descripcion: string;
}

class EventService {
  private baseURL = 'http://localhost:3001/api/eventos';

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  async createEvent(eventData: EventData): Promise<{ success: boolean; data?: any; message?: string; errors?: any }> {
    try {
      const response = await fetch(`${this.baseURL}/create`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(eventData)
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al crear evento:', error);
      return {
        success: false,
        message: 'Error de conexión con el servidor'
      };
    }
  }

  async getEventsByOrganization(): Promise<{ success: boolean; data?: Event[]; message?: string }> {
    try {
      const response = await fetch(`${this.baseURL}/organization`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener eventos:', error);
      return {
        success: false,
        message: 'Error de conexión con el servidor'
      };
    }
  }

  async getCategorias(): Promise<{ success: boolean; data?: Categoria[]; message?: string }> {
    try {
      const response = await fetch(`${this.baseURL}/categorias`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      return {
        success: false,
        message: 'Error de conexión con el servidor'
      };
    }
  }

  async updateEvent(eventId: number, eventData: Partial<EventData>): Promise<{ success: boolean; data?: any; message?: string; errors?: any }> {
    try {
      const response = await fetch(`${this.baseURL}/${eventId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(eventData)
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al actualizar evento:', error);
      return {
        success: false,
        message: 'Error de conexión con el servidor'
      };
    }
  }

  async deleteEvent(eventId: number): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`${this.baseURL}/${eventId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al eliminar evento:', error);
      return {
        success: false,
        message: 'Error de conexión con el servidor'
      };
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatTime(timeString: string): string {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getEventStatus(fechaInicio: string, fechaFin: string): { status: string; color: string } {
    const now = new Date();
    const start = new Date(fechaInicio);
    const end = new Date(fechaFin);

    if (now < start) {
      return { status: 'Próximo', color: 'blue' };
    } else if (now >= start && now <= end) {
      return { status: 'En Curso', color: 'green' };
    } else {
      return { status: 'Finalizado', color: 'gray' };
    }
  }
}

export const eventService = new EventService();
