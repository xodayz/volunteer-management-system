import { useEffect, useState } from 'react';
import { AuthService } from '../services/authService';
import { User, Calendar, Heart, Award } from 'lucide-react';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = AuthService.getUser();
    setUser(userData);
  }, []);

  const handleLogout = () => {
    AuthService.logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-indigo-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Panel de Voluntario</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">{user?.nombre || 'Usuario'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            ¡Bienvenido, {user?.nombre || 'Voluntario'}!
          </h2>
          <p className="text-gray-600">
            Gracias por formar parte de nuestra comunidad de voluntarios. Aquí puedes gestionar tu perfil y encontrar nuevos eventos para ayudar.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Próximos Eventos</h3>
                <p className="text-2xl font-bold text-blue-600">3</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-red-600 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Horas Completadas</h3>
                <p className="text-2xl font-bold text-red-600">24</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-yellow-600 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Reconocimientos</h3>
                <p className="text-2xl font-bold text-yellow-600">2</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Acciones Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <a
              href="/dashboard/events"
              className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-lg transition-colors text-center"
            >
              Eventos
            </a>
            <button className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg transition-colors">
              Mi Perfil
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg transition-colors">
              Historial
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
