import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Building } from 'lucide-react';
import { OrganizacionAuthService, type OrganizacionLoginData } from '../services/organizacionAuthService';

export default function LoginFormOrganizacion() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState<OrganizacionLoginData>({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {

      const result = await OrganizacionAuthService.login(formData);
      
      if (result.success) {
        console.log('✅ Login exitoso, redirigiendo a dashboard de organizaciones...');
        window.location.href = '/dashboard-organizacion';
      } else {
        setError(result.message || 'Error en el inicio de sesión');
      }
    } catch (error) {
      setError('Error de conexión con el servidor');
      console.error('Error en login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-purple-600 via-pink-500 to-red-500">
      <div className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Building className="h-8 w-8 text-purple-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Portal de Organizaciones
            </h2>
            <p className="text-gray-600">
              Accede como organización para gestionar oportunidades
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

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo de la Organización
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="organizacion@ejemplo.com"
                  required
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors bg-white text-gray-900 placeholder-gray-500"
                />
              </div>
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

            {/* Options */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-gray-600">Recordarme</span>
              </label>
              <div className="text-right">
                <a href="#" className="text-sm text-purple-600 hover:text-purple-500 font-medium block">
                  ¿Olvidaste tu contraseña?
                </a>
                <a href="/login" className="text-sm text-indigo-600 hover:text-indigo-500 font-medium block mt-1">
                  ¿Eres voluntario?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg disabled:bg-purple-400 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? 'Iniciando sesión...' : 'Acceder como Organización'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              ¿Tu organización no está registrada?{' '}
              <a href="/register-organizacion" className="text-purple-600 hover:text-purple-500 font-medium">
                Regístrate aquí
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
