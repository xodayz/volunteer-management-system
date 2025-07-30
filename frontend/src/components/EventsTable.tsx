import React from 'react';
import { Calendar, Clock, MapPin, Users, Tag, Edit, Trash2 } from 'lucide-react';
import type { Event } from '../services/eventService';
import { eventService } from '../services/eventService';

interface EventsTableProps {
  events: Event[];
  onEditEvent?: (event: Event) => void;
  onDeleteEvent?: (eventId: number) => void;
  onRefresh?: () => void;
}

const EventsTable: React.FC<EventsTableProps> = ({ 
  events, 
  onEditEvent, 
  onDeleteEvent,
  onRefresh 
}) => {
  const handleDeleteClick = async (eventId: number, eventName: string) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el evento "${eventName}"?`)) {
      try {
        const result = await eventService.deleteEvent(eventId);
        if (result.success) {
          onRefresh?.();
        } else {
          alert('Error al eliminar el evento: ' + result.message);
        }
      } catch (error) {
        alert('Error de conexión al eliminar el evento');
      }
    }
  };

  const getStatusBadge = (fechaInicio: string, fechaFin: string) => {
    const { status, color } = eventService.getEventStatus(fechaInicio, fechaFin);
    
    const colorClasses = {
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      gray: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClasses[color as keyof typeof colorClasses]}`}>
        {status}
      </span>
    );
  };

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
        <h3 className="text-lg font-medium text-gray-600 mb-2">No hay eventos creados</h3>
        <p className="text-gray-500">Crea tu primer evento haciendo clic en "Nuevo Evento"</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map(event => (
        <div key={event.id_evento} className="border border-gray-200 rounded-lg p-6 bg-white hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800">{event.nombre}</h3>
                {getStatusBadge(event.fecha_inicio, event.fecha_fin)}
              </div>
              
              {event.categoria_nombre && (
                <div className="flex items-center text-purple-600 text-sm mb-2">
                  <Tag size={14} className="mr-1" />
                  {event.categoria_nombre}
                </div>
              )}
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{event.descripcion}</p>
            </div>

            {(onEditEvent || onDeleteEvent) && (
              <div className="flex space-x-2 ml-4">
                {onEditEvent && (
                  <button
                    onClick={() => onEditEvent(event)}
                    className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                    title="Editar evento"
                  >
                    <Edit size={16} />
                  </button>
                )}
                {onDeleteEvent && (
                  <button
                    onClick={() => handleDeleteClick(event.id_evento, event.nombre)}
                    className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                    title="Eliminar evento"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center text-gray-600">
              <Calendar size={14} className="mr-2 text-purple-600" />
              <div>
                <div className="font-medium">Inicio</div>
                <div>{eventService.formatDate(event.fecha_inicio)}</div>
                <div className="text-xs">{eventService.formatTime(event.hora_inicio)}</div>
              </div>
            </div>

            <div className="flex items-center text-gray-600">
              <Clock size={14} className="mr-2 text-purple-600" />
              <div>
                <div className="font-medium">Fin</div>
                <div>{eventService.formatDate(event.fecha_fin)}</div>
                <div className="text-xs">{eventService.formatTime(event.hora_fin)}</div>
              </div>
            </div>

            <div className="flex items-center text-gray-600">
              <MapPin size={14} className="mr-2 text-purple-600" />
              <div>
                <div className="font-medium">Ubicación</div>
                <div className="text-xs line-clamp-2">{event.direccion}</div>
              </div>
            </div>

            <div className="flex items-center text-gray-600">
              <Users size={14} className="mr-2 text-purple-600" />
              <div>
                <div className="font-medium">Participantes</div>
                <div>
                  {event.voluntarios_inscritos?.length || 0} / {event.capacidad_maxima}
                </div>
                <div className="text-xs">
                  {event.capacidad_maxima - (event.voluntarios_inscritos?.length || 0)} disponibles
                </div>
              </div>
            </div>
          </div>

          {event.requisitos && event.requisitos.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="text-sm text-gray-600 mb-2">
                <strong>Requisitos:</strong>
              </div>
              <div className="flex flex-wrap gap-2">
                {event.requisitos.map((requisito, index) => (
                  <span 
                    key={index}
                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                  >
                    {requisito}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default EventsTable;
