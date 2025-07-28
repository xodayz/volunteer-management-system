import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Building, User, Phone, Globe, FileText, MapPin } from 'lucide-react';
import { OrganizacionAuthService, type OrganizacionRegisterData } from '../services/organizacionAuthService';

interface OrganizacionFormData extends OrganizacionRegisterData {
  confirmPassword: string;
}

export default function RegisterFormOrganizacion() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState<OrganizacionFormData>({
    nombreOrganizacion: '',
    nombreRepresentante: '',
    correoRepresentante: '',
    telefono: '',
    sitioWeb: '',
    descripcion: '',
    direccion: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    if (formData.descripcion.length < 10) {
      setError('La descripción debe tener al menos 10 caracteres');
      setIsLoading(false);
      return;
    }

    try {
      const registerData: OrganizacionRegisterData = {
        nombreOrganizacion: formData.nombreOrganizacion,
        nombreRepresentante: formData.nombreRepresentante,
        correoRepresentante: formData.correoRepresentante,
        password: formData.password,
        telefono: formData.telefono,
        sitioWeb: formData.sitioWeb,
        descripcion: formData.descripcion,
        direccion: formData.direccion
      };

      const result = await OrganizacionAuthService.register(registerData);
      
      if (result.success) {
        alert('¡Organización registrada exitosamente!');
        window.location.href = '/dashboard-organizacion';
      } else {
        setError(result.message || 'Error en el registro');
      }
      
    } catch (error) {
      setError('Error de conexión con el servidor');
      console.error('Error en registro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-purple-600 via-pink-500 to-red-500">
      <div className="w-full max-w-lg">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Building className="h-8 w-8 text-purple-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Registro de Organización
            </h2>
            <p className="text-gray-600">
              Únete a nuestra plataforma y conecta con voluntarios
            </p>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Grid de campos principales */}
            <div className="space-y-6">
              {/* Nombre de la Organización */}
              <div>
                <label htmlFor="nombreOrganizacion" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la Organización *
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    id="nombreOrganizacion"
                    name="nombreOrganizacion"
                    value={formData.nombreOrganizacion}
                    onChange={handleChange}
                    placeholder="Fundación Ejemplo"
                    required
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors bg-white text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Nombre del Representante */}
              <div>
                <label htmlFor="nombreRepresentante" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Representante *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    id="nombreRepresentante"
                    name="nombreRepresentante"
                    value={formData.nombreRepresentante}
                    onChange={handleChange}
                    placeholder="Juan Pérez"
                    required
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors bg-white text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Correo del Representante */}
              <div>
                <label htmlFor="correoRepresentante" className="block text-sm font-medium text-gray-700 mb-2">
                  Correo del Representante *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    id="correoRepresentante"
                    name="correoRepresentante"
                    value={formData.correoRepresentante}
                    onChange={handleChange}
                    placeholder="representante@organizacion.com"
                    required
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors bg-white text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Teléfono */}
              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    required
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors bg-white text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Sitio Web */}
              <div>
                <label htmlFor="sitioWeb" className="block text-sm font-medium text-gray-700 mb-2">
                  Sitio Web
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="url"
                    id="sitioWeb"
                    name="sitioWeb"
                    value={formData.sitioWeb}
                    onChange={handleChange}
                    placeholder="https://www.organizacion.com"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors bg-white text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Dirección */}
              <div>
                <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                  <textarea
                    id="direccion"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Dirección completa de la organización (calle, número, ciudad, país)..."
                    required
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors bg-white text-gray-900 placeholder-gray-500 resize-none"
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors bg-white text-gray-900 placeholder-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirmar Contraseña */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Contraseña *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors bg-white text-gray-900 placeholder-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Descripción de la Organización */}
            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
                Descripción de la Organización * (mínimo 10 caracteres)
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-gray-400" size={20} />
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Describe detalladamente la misión, visión y actividades principales de tu organización (mínimo 10 caracteres)..."
                  required
                  rows={4}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors bg-white text-gray-900 placeholder-gray-500 resize-vertical"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg disabled:bg-purple-400 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? 'Registrando organización...' : 'Registrar Organización'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <a href="/login-organizacion" className="text-purple-600 hover:text-purple-500 font-medium">
                Inicia sesión aquí
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
