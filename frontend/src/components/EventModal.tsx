import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, Users, FileText, Tag } from 'lucide-react';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (eventData: EventFormData) => void;
}

interface EventFormData {
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

interface Categoria {
  id_categoria: number;
  nombre: string;
  descripcion: string;
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<EventFormData>({
    nombre: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    horaInicio: '',
    horaFin: '',
    direccion: '',
    idCategoria: 0,
    capacidadMaxima: 50,
    requisitos: []
  });

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [requisitoInput, setRequisitoInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      fetchCategorias();
    }
  }, [isOpen]);

  const fetchCategorias = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/eventos/categorias');
      if (response.ok) {
        const data = await response.json();
        setCategorias(data.categorias || []);
      }
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacidadMaxima' || name === 'idCategoria' ? parseInt(value) || 0 : value
    }));
  };

  const addRequisito = () => {
    if (requisitoInput.trim() && !formData.requisitos.includes(requisitoInput.trim())) {
      setFormData(prev => ({
        ...prev,
        requisitos: [...prev.requisitos, requisitoInput.trim()]
      }));
      setRequisitoInput('');
    }
  };

  const removeRequisito = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requisitos: prev.requisitos.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.descripcion.trim()) newErrors.descripcion = 'La descripción es requerida';
    if (!formData.fechaInicio) newErrors.fechaInicio = 'La fecha de inicio es requerida';
    if (!formData.fechaFin) newErrors.fechaFin = 'La fecha de fin es requerida';
    if (!formData.horaInicio) newErrors.horaInicio = 'La hora de inicio es requerida';
    if (!formData.horaFin) newErrors.horaFin = 'La hora de fin es requerida';
    if (!formData.direccion.trim()) newErrors.direccion = 'La dirección es requerida';
    if (!formData.idCategoria) newErrors.idCategoria = 'La categoría es requerida';
    if (formData.capacidadMaxima <= 0) newErrors.capacidadMaxima = 'La capacidad debe ser mayor a 0';

    if (formData.fechaInicio && formData.fechaFin) {
      if (new Date(formData.fechaFin) < new Date(formData.fechaInicio)) {
        newErrors.fechaFin = 'La fecha de fin debe ser posterior a la fecha de inicio';
      }
    }

    if (formData.fechaInicio === formData.fechaFin && formData.horaInicio && formData.horaFin) {
      if (formData.horaFin <= formData.horaInicio) {
        newErrors.horaFin = 'La hora de fin debe ser posterior a la hora de inicio';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      setFormData({
        nombre: '',
        descripcion: '',
        fechaInicio: '',
        fechaFin: '',
        horaInicio: '',
        horaFin: '',
        direccion: '',
        idCategoria: 0,
        capacidadMaxima: 50,
        requisitos: []
      });
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Calendar className="mr-2 text-purple-600" size={24} />
            Crear Nuevo Evento
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="inline mr-1" size={16} />
                Nombre del Evento *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.nombre ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: Limpieza de Playa Boca Chica"
              />
              {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="inline mr-1" size={16} />
                Categoría *
              </label>
              <select
                name="idCategoria"
                value={formData.idCategoria}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.idCategoria ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value={0}>Seleccionar categoría</option>
                {categorias.map(categoria => (
                  <option key={categoria.id_categoria} value={categoria.id_categoria}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
              {errors.idCategoria && <p className="text-red-500 text-sm mt-1">{errors.idCategoria}</p>}
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción *
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none ${
                errors.descripcion ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describe el evento, objetivos, actividades a realizar..."
            />
            {errors.descripcion && <p className="text-red-500 text-sm mt-1">{errors.descripcion}</p>}
          </div>

          {/* Fechas y horarios */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline mr-1" size={16} />
                  Fecha de Inicio *
                </label>
                <input
                  type="date"
                  name="fechaInicio"
                  value={formData.fechaInicio}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.fechaInicio ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.fechaInicio && <p className="text-red-500 text-sm mt-1">{errors.fechaInicio}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="inline mr-1" size={16} />
                  Hora de Inicio *
                </label>
                <input
                  type="time"
                  name="horaInicio"
                  value={formData.horaInicio}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.horaInicio ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.horaInicio && <p className="text-red-500 text-sm mt-1">{errors.horaInicio}</p>}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline mr-1" size={16} />
                  Fecha de Fin *
                </label>
                <input
                  type="date"
                  name="fechaFin"
                  value={formData.fechaFin}
                  onChange={handleInputChange}
                  min={formData.fechaInicio || new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.fechaFin ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.fechaFin && <p className="text-red-500 text-sm mt-1">{errors.fechaFin}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="inline mr-1" size={16} />
                  Hora de Fin *
                </label>
                <input
                  type="time"
                  name="horaFin"
                  value={formData.horaFin}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.horaFin ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.horaFin && <p className="text-red-500 text-sm mt-1">{errors.horaFin}</p>}
              </div>
            </div>
          </div>

          {/* Dirección y capacidad */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline mr-1" size={16} />
                Dirección *
              </label>
              <textarea
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none ${
                  errors.direccion ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Dirección completa donde se realizará el evento"
              />
              {errors.direccion && <p className="text-red-500 text-sm mt-1">{errors.direccion}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="inline mr-1" size={16} />
                Capacidad Máxima *
              </label>
              <input
                type="number"
                name="capacidadMaxima"
                value={formData.capacidadMaxima}
                onChange={handleInputChange}
                min="1"
                max="1000"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.capacidadMaxima ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Número máximo de voluntarios"
              />
              {errors.capacidadMaxima && <p className="text-red-500 text-sm mt-1">{errors.capacidadMaxima}</p>}
            </div>
          </div>

          {/* Requisitos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Requisitos del Evento
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={requisitoInput}
                onChange={(e) => setRequisitoInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequisito())}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Ej: Mayor de edad, experiencia previa, equipo de protección..."
              />
              <button
                type="button"
                onClick={addRequisito}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Agregar
              </button>
            </div>
            {formData.requisitos.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.requisitos.map((requisito, index) => (
                  <span
                    key={index}
                    className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {requisito}
                    <button
                      type="button"
                      onClick={() => removeRequisito(index)}
                      className="ml-2 text-purple-600 hover:text-purple-800"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Crear Evento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
