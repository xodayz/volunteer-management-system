import { useEffect, useState } from 'react';
import { eventService, type Event } from '../services/eventService';
import { AuthService } from '../services/authService';
import { Calendar, MapPin, Users, Clock, Award } from 'lucide-react';

export default function EventsList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = AuthService.getUser();
    setUser(userData);
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const eventsData = await eventService.getAllEvents();
      setEvents(eventsData);
      setError(null);
    } catch (err) {
      console.error('❌ Error al cargar eventos:', err);
      setError('Error al cargar los eventos');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId: number) => {
    if (!user) {
      alert('Debes iniciar sesión para inscribirte');
      return;
    }

    try {
      const result = await eventService.registerToEvent(eventId);
      
      if (result.success) {
        alert('¡Te has inscrito exitosamente al evento!');
        // Recargar eventos para actualizar la lista
        loadEvents();
      } else {
        alert(result.message || 'Error al inscribirse al evento');
      }
    } catch (error) {
      console.error('Error al inscribirse:', error);
      alert('Error de conexión. Intenta nuevamente.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isUserRegistered = (event: Event) => {
    return user && event.voluntarios_inscritos.includes(user.id_usuario.toString());
  };

  const getEventStatus = (fechaInicio: string, fechaFin: string) => {
    const now = new Date();
    const start = new Date(fechaInicio);
    const end = new Date(fechaFin);

    if (now < start) {
      return { status: 'Próximo', color: 'bg-blue-100 text-blue-800' };
    } else if (now >= start && now <= end) {
      return { status: 'En Curso', color: 'bg-green-100 text-green-800' };
    } else {
      return { status: 'Finalizado', color: 'bg-gray-100 text-gray-800' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Cargando eventos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center">
        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-8 py-6 rounded-xl max-w-md text-center">
          <h3 className="text-lg font-semibold mb-2">Error al cargar eventos</h3>
          <p className="mb-4">{error}</p>
          <button 
            onClick={loadEvents}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div className="text-center flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Eventos de Voluntariado</h1>
              <p className="text-xl text-gray-600">Encuentra tu próximo evento para ayudar</p>
              <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{events.length} eventos disponibles</span>
              </div>
            </div>
            <a
              href="/dashboard"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors font-medium shadow-md hover:shadow-lg transform hover:scale-105 ml-8"
            >
              Volver al Dashboard
            </a>
          </div>
        </div>
      </header>

      {/* Events Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {events.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-xl shadow-lg p-12 max-w-lg mx-auto">
              <Calendar className="h-20 w-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No hay eventos disponibles</h3>
              <p className="text-gray-600 mb-6">Vuelve pronto para ver nuevos eventos de voluntariado.</p>
              <button 
                onClick={loadEvents}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
              >
                Actualizar eventos
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 justify-items-center">
            {events.map((event) => {
              const eventStatus = getEventStatus(event.fecha_inicio, event.fecha_fin);
              const userRegistered = isUserRegistered(event);
              const isFull = event.voluntarios_inscritos.length >= event.capacidad_maxima;
              
              return (
                <div key={event.id_evento} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-full max-w-md">
                  {/* Event Header */}
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-white line-clamp-2 flex-1 mr-2">{event.nombre}</h3>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${eventStatus.status === 'Próximo' ? 'bg-blue-100 text-blue-800' : eventStatus.status === 'En Curso' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} whitespace-nowrap`}>
                        {eventStatus.status}
                      </span>
                    </div>
                    
                    {event.categoria_nombre && (
                      <div className="flex items-center text-white/90 text-sm">
                        <Award className="h-4 w-4 mr-2" />
                        <span>{event.categoria_nombre}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">{event.descripcion}</p>
                    
                    {/* Event Details */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-sm text-gray-700">
                        <Calendar className="h-4 w-4 mr-3 text-indigo-500" />
                        <span className="font-medium">
                          {formatDate(event.fecha_inicio)}
                          {event.fecha_inicio !== event.fecha_fin && (
                            <span className="text-gray-500"> - {formatDate(event.fecha_fin)}</span>
                          )}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-700">
                        <Clock className="h-4 w-4 mr-3 text-indigo-500" />
                        <span className="font-medium">
                          {formatTime(event.hora_inicio)}
                          {event.hora_fin && (
                            <span className="text-gray-500"> - {formatTime(event.hora_fin)}</span>
                          )}
                        </span>
                      </div>
                      
                      {event.direccion && (
                        <div className="flex items-center text-sm text-gray-700">
                          <MapPin className="h-4 w-4 mr-3 text-indigo-500" />
                          <span className="line-clamp-2 font-medium">{event.direccion}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center text-sm text-gray-700">
                        <Users className="h-4 w-4 mr-3 text-indigo-500" />
                        <span className="font-medium">
                          {event.voluntarios_inscritos.length} / {event.capacidad_maxima} voluntarios
                        </span>
                        <div className="ml-2 flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min((event.voluntarios_inscritos.length / event.capacidad_maxima) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <div className="px-6 pb-6">
                    {userRegistered ? (
                      <button
                        disabled
                        className="w-full bg-green-50 border-2 border-green-200 text-green-700 py-3 px-4 rounded-lg font-semibold cursor-not-allowed flex items-center justify-center"
                      >
                        <span className="mr-2">✓</span>
                        Ya estás inscrito
                      </button>
                    ) : isFull ? (
                      <button
                        disabled
                        className="w-full bg-gray-50 border-2 border-gray-200 text-gray-500 py-3 px-4 rounded-lg font-semibold cursor-not-allowed"
                      >
                        Evento lleno
                      </button>
                    ) : eventStatus.status === 'Finalizado' ? (
                      <button
                        disabled
                        className="w-full bg-gray-50 border-2 border-gray-200 text-gray-500 py-3 px-4 rounded-lg font-semibold cursor-not-allowed"
                      >
                        Evento finalizado
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRegister(event.id_evento)}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                      >
                        Inscribirse al evento
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
