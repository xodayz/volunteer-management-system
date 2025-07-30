import { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, Calendar, Heart, ChevronDown } from 'lucide-react';
import { AuthService, type RegisterData } from '../services/authService';

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [showInteresesDropdown, setShowInteresesDropdown] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<RegisterData>({
    username: '',
    nombre: '',
    correo: '',
    password: '',
    telefono: '',
    fecha_nacimiento: '',
    direccion: '',
    interes_habilidades: []
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowInteresesDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const validateAge = (birthDate: string): boolean => {
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1 >= 18;
    }
    return age >= 18;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (formData.password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }

    if (formData.fecha_nacimiento && !validateAge(formData.fecha_nacimiento)) {
      setError('Debes ser mayor de 18 años para registrarte');
      setIsLoading(false);
      return;
    }

    if (formData.interes_habilidades?.length === 0) {
      setError('Debes seleccionar al menos un interés o habilidad');
      setIsLoading(false);
      return;
    }

    try {
      const result = await AuthService.register(formData);
      
      if (result.success) {
        setSuccess('Registro exitoso. Redirigiendo...');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      } else {
        if (result.errors && result.errors.length > 0) {
          setError(result.errors[0].msg || result.message);
        } else {
          setError(result.message || 'Error en el registro');
        }
      }
    } catch (error) {
      setError('Error de conexión con el servidor');
      console.error('Error en registro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleInteresesChange = (interes: string) => {
    const currentIntereses = formData.interes_habilidades || [];
    let newIntereses;
    
    if (currentIntereses.includes(interes)) {
      newIntereses = currentIntereses.filter(item => item !== interes);
    } else {
      newIntereses = [...currentIntereses, interes];
    }
    
    setFormData({
      ...formData,
      interes_habilidades: newIntereses
    });
    
    if (error) setError('');
    if (success) setSuccess('');
  };

  const interesesOptions = [
    { value: 'educacion', label: 'Educación y Enseñanza' },
    { value: 'salud', label: 'Salud y Bienestar' },
    { value: 'medio_ambiente', label: 'Medio Ambiente' },
    { value: 'asistencia_social', label: 'Asistencia Social' },
    { value: 'tecnologia', label: 'Tecnología e Informática' },
    { value: 'arte_cultura', label: 'Arte y Cultura' },
    { value: 'deportes', label: 'Deportes y Recreación' },
    { value: 'construccion', label: 'Construcción y Reparación' },
    { value: 'administracion', label: 'Administración y Gestión' },
    { value: 'marketing', label: 'Marketing y Comunicación' },
    { value: 'cocina', label: 'Cocina y Alimentación' },
    { value: 'traduccion', label: 'Traducción e Idiomas' },
    { value: 'cuidado_animales', label: 'Cuidado de Animales' },
    { value: 'organizacion_eventos', label: 'Organización de Eventos' },
    { value: 'fotografia', label: 'Fotografía y Video' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-green-500 via-blue-500 to-purple-500">
      <div className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Crear Cuenta
            </h2>
            <p className="text-gray-600">
              Únete a nuestra comunidad de voluntarios
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

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-600 text-sm">{success}</p>
              </div>
            )}

            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de Usuario
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="usuario123"
                  required
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-colors bg-white text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>

            {/* Name Field */}
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Juan Pérez"
                  required
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-colors bg-white text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  placeholder="tu@correo.com"
                  required
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-colors bg-white text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono (Opcional)
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
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-colors bg-white text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>

            {/* Birth Date Field */}
            <div>
              <label htmlFor="fecha_nacimiento" className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Nacimiento
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="date"
                  id="fecha_nacimiento"
                  name="fecha_nacimiento"
                  value={formData.fecha_nacimiento}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-colors bg-white text-gray-900"
                />
              </div>
            </div>

            {/* Address Field */}
            <div>
              <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-2">
                Dirección
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                <textarea
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Dirección completa donde resides"
                  required
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-colors bg-white text-gray-900 placeholder-gray-500 resize-none"
                />
              </div>
            </div>

            {/* Interests and Skills Field */}
            <div ref={dropdownRef}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Intereses y Habilidades *
              </label>
              <div className="relative">
                <Heart className="absolute left-3 top-3 text-gray-400 z-10" size={20} />
                <button
                  type="button"
                  onClick={() => setShowInteresesDropdown(!showInteresesDropdown)}
                  className="w-full pl-12 pr-10 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-colors bg-white text-gray-900 text-left min-h-[48px] flex items-center justify-between"
                >
                  <span className="text-sm">
                    {formData.interes_habilidades && formData.interes_habilidades.length > 0
                      ? `${formData.interes_habilidades.length} seleccionado(s)`
                      : 'Selecciona tus intereses y habilidades'}
                  </span>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-400 transition-transform ${showInteresesDropdown ? 'rotate-180' : ''}`} 
                  />
                </button>
                
                {showInteresesDropdown && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {interesesOptions.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.interes_habilidades?.includes(option.value) || false}
                          onChange={() => handleInteresesChange(option.value)}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 mr-3"
                        />
                        <span className="text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Selected interests display */}
              {formData.interes_habilidades && formData.interes_habilidades.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {formData.interes_habilidades.map((interes) => {
                    const option = interesesOptions.find(opt => opt.value === interes);
                    return (
                      <span
                        key={interes}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                      >
                        {option?.label}
                        <button
                          type="button"
                          onClick={() => handleInteresesChange(interes)}
                          className="ml-1 text-green-600 hover:text-green-800"
                        >
                          ×
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
              
              <p className="mt-2 text-xs text-gray-500">
                Selecciona al menos un interés o habilidad para tu perfil de voluntario.
              </p>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
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
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-colors bg-white text-gray-900 placeholder-gray-500"
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

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-colors bg-white text-gray-900 placeholder-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {confirmPassword && formData.password !== confirmPassword && (
                <p className="mt-1 text-sm text-red-600">Las contraseñas no coinciden</p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula y un número.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500/20 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg disabled:bg-green-400 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <a href="/login" className="text-green-600 hover:text-green-500 font-medium">
                Inicia sesión aquí
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
