# Documentación del Frontend - Astro/React

Esta documentación cubre la instalación, configuración y uso del cliente frontend del Sistema de Gestión de Voluntariado, construido con Astro, React, TypeScript y Tailwind CSS.

## 📋 Tabla de Contenidos

- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Ejecución](#ejecución)
- [Componentes](#componentes)
- [Rutas y Navegación](#rutas-y-navegación)
- [Servicios de API](#servicios-de-api)
- [Estilos y Temas](#estilos-y-temas)
- [Autenticación](#autenticación)
- [Build y Deployment](#build-y-deployment)
- [Resolución de Problemas](#resolución-de-problemas)

## 🔧 Requisitos Previos

Antes de configurar el frontend, asegúrate de tener:

- **Node.js** 18.x o superior
- **npm** 9.x o superior
- **Backend** del sistema ejecutándose en `http://localhost:3001`

### Verificar Requisitos

```bash
# Verificar versiones
node --version    # debe ser >= 18.0.0
npm --version     # debe ser >= 9.0.0

# Verificar que el backend esté ejecutándose
curl http://localhost:3001/api/health
# O en PowerShell:
Invoke-RestMethod -Uri "http://localhost:3001/api/health" -Method GET
```

## 📦 Instalación

### 1. Navegar al Directorio del Frontend

```bash
cd sistema-voluntariado/frontend
```

### 2. Instalar Dependencias

```bash
# Instalar todas las dependencias
npm install

# Verificar instalación
npm list --depth=0
```

### Dependencias Principales

**Frameworks y Librerías:**
- `astro` - Framework web moderno y rápido
- `@astrojs/react` - Integración de React con Astro
- `@astrojs/tailwind` - Integración de Tailwind CSS
- `react` - Librería para interfaces de usuario
- `@types/react` - Definiciones de tipos para React

**Utilidades:**
- `react-hook-form` - Manejo de formularios
- `@hookform/resolvers` - Validadores para formularios
- `zod` - Validación de esquemas de datos
- `lucide-react` - Iconos para React
- `tailwindcss` - Framework CSS utility-first
- `autoprefixer` - PostCSS plugin para prefijos CSS

## ⚙️ Configuración

### 1. Configuración de Astro

El archivo `astro.config.mjs` está configurado para integrar React y Tailwind:

```javascript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [
    react(),
    tailwind()
  ],
  server: {
    port: 4321,
    host: true
  }
});
```

### 2. Configuración de TypeScript

El archivo `tsconfig.json` está configurado para Astro y React:

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "allowJs": true,
    "checkJs": false
  }
}
```

### 3. Configuración de Tailwind

El archivo `tailwind.config.mjs`:

```javascript
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8'
        }
      }
    },
  },
  plugins: [],
}
```

## 🏗️ Estructura del Proyecto

```
frontend/
├── public/
│   ├── favicon.svg              # Favicon del sitio
│   └── [assets estáticos]       # Imágenes, iconos, etc.
├── src/
│   ├── assets/
│   │   ├── astro.svg           # Logo de Astro
│   │   └── background.svg       # Imagen de fondo
│   ├── components/
│   │   ├── About.astro         # Componente "Acerca de"
│   │   ├── Dashboard.tsx       # Dashboard principal
│   │   ├── Footer.astro        # Pie de página
│   │   ├── Hero.astro          # Sección hero
│   │   ├── LoginForm.tsx       # Formulario de login usuarios
│   │   ├── Navbar.astro        # Barra de navegación
│   │   ├── ProtectedRoute.tsx  # Componente de ruta protegida
│   │   ├── RegisterForm.tsx    # Formulario de registro usuarios
│   │   ├── Welcome.astro       # Componente de bienvenida
│   │   ├── about-us/
│   │   │   └── About.astro     # Sección "Acerca de nosotros"
│   │   ├── footer/
│   │   │   └── Footer.astro    # Componente footer modular
│   │   ├── hero/
│   │   │   └── Hero.astro      # Componente hero modular
│   │   └── navbar/
│   │       └── Navbar.astro    # Componente navbar modular
│   ├── layouts/
│   │   └── Layout.astro        # Layout base del sitio
│   ├── pages/
│   │   ├── index.astro         # Página de inicio
│   │   ├── login.astro         # Página de login usuarios
│   │   ├── login-new.astro     # Nueva página de login
│   │   ├── register.astro      # Página de registro usuarios
│   │   ├── dashboard.astro     # Dashboard usuarios
│   │   └── dashboard/
│   │       └── opportunities.astro # Página de oportunidades
│   ├── services/
│   │   ├── authService.ts      # Servicio de autenticación usuarios
│   │   └── organizacionAuthService.ts # Servicio auth organizaciones
│   └── styles/
│       └── global.css          # Estilos globales
├── astro.config.mjs            # Configuración de Astro
├── package.json                # Dependencias y scripts
├── postcss.config.js           # Configuración PostCSS
├── tailwind.config.mjs         # Configuración Tailwind
├── tsconfig.json              # Configuración TypeScript
└── README.md                  # Esta documentación
```

### Descripción de Directorios

**Public:**
- Archivos estáticos que se sirven directamente
- No procesados por el bundler

**Components:**
- Componentes reutilizables de UI
- Mezcla de Astro (.astro) y React (.tsx)

**Layouts:**
- Plantillas base para páginas
- Define estructura común (header, footer, etc.)

**Pages:**
- Páginas del sitio (file-based routing)
- Cada archivo se convierte en una ruta

**Services:**
- Lógica de comunicación con APIs
- Funciones utilitarias

**Styles:**
- Estilos globales y configuraciones CSS

## 🚀 Ejecución

### Scripts Disponibles

```bash
# Desarrollo (servidor con hot reload)
npm run dev

# Build para producción
npm run build

# Preview del build de producción
npm run preview

# Comandos adicionales de Astro
npm run astro -- --help
```

### Iniciar en Modo Desarrollo

```bash
# Terminal 2: Iniciar frontend (asegúrate que el backend esté ejecutándose)
cd frontend
npm run dev

# El servidor debería mostrar:
# Local:    http://localhost:4321/
# Network:  http://[tu-ip]:4321/
```

### Verificar que el Frontend está Ejecutándose

```bash
# Abrir en navegador
start http://localhost:4321
# O en macOS/Linux:
open http://localhost:4321
```

## 🧩 Componentes

### Componentes Astro (.astro)

**Layout.astro** - Layout base:
```astro
---
export interface Props {
  title: string;
}

const { title } = Astro.props;
---

<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="description" content="Sistema de Gestión de Voluntariado" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>{title}</title>
  </head>
  <body>
    <slot />
  </body>
</html>
```

**Navbar.astro** - Barra de navegación:
```astro
---
// Scripts y lógica del componente
---

<nav class="bg-blue-600 text-white">
  <div class="max-w-7xl mx-auto px-4">
    <div class="flex justify-between h-16">
      <div class="flex items-center">
        <a href="/" class="text-xl font-bold">Sistema Voluntariado</a>
      </div>
      <div class="flex items-center space-x-4">
        <a href="/login" class="hover:text-blue-200">Iniciar Sesión</a>
        <a href="/register" class="bg-blue-700 px-4 py-2 rounded">Registrarse</a>
      </div>
    </div>
  </div>
</nav>
```

### Componentes React (.tsx)

**LoginForm.tsx** - Formulario de login:
```tsx
import React, { useState } from 'react';
import { authService } from '../services/authService';

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    correo: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await authService.login(formData.correo, formData.password);
      onSuccess?.();
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          value={formData.correo}
          onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Contraseña
        </label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>
    </form>
  );
};
```

**ProtectedRoute.tsx** - Componente de ruta protegida:
```tsx
import React, { useEffect, useState } from 'react';
import { authService } from '../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback 
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        setIsAuthenticated(!!user);
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>;
  }

  if (!isAuthenticated) {
    return fallback || <div>Acceso denegado. Por favor inicia sesión.</div>;
  }

  return <>{children}</>;
};
```

## 🗺️ Rutas y Navegación

### Sistema de Rutas de Astro

Astro usa file-based routing. Cada archivo en `src/pages/` se convierte en una ruta:

```
src/pages/
├── index.astro           → /
├── login.astro           → /login
├── register.astro        → /register
├── dashboard.astro       → /dashboard
└── dashboard/
    └── opportunities.astro → /dashboard/opportunities
```

### Páginas Principales

**index.astro** - Página de inicio:
```astro
---
import Layout from '../layouts/Layout.astro';
import Hero from '../components/Hero.astro';
import About from '../components/About.astro';
import Footer from '../components/Footer.astro';
---

<Layout title="Sistema de Gestión de Voluntariado">
  <Hero />
  <About />
  <Footer />
</Layout>
```

**login.astro** - Página de login:
```astro
---
import Layout from '../layouts/Layout.astro';
import { LoginForm } from '../components/LoginForm';
---

<Layout title="Iniciar Sesión - Sistema Voluntariado">
  <main class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Iniciar Sesión
      </h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <LoginForm client:load />
      </div>
    </div>
  </main>
</Layout>
```

### Navegación entre Páginas

```javascript
// Navegación programática en componentes React
const handleLoginSuccess = () => {
  window.location.href = '/dashboard';
};

// Enlaces en Astro
<a href="/dashboard" class="text-blue-600 hover:text-blue-800">
  Ir al Dashboard
</a>
```

## 🔌 Servicios de API

### authService.ts - Autenticación de Usuarios

```typescript
interface User {
  id_usuario: number;
  username: string;
  nombre: string;
  correo: string;
  telefono?: string;
  fecha_registro: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

class AuthService {
  private baseURL = 'http://localhost:3001/api/auth';
  private tokenKey = 'auth_token';

  async login(correo: string, password: string): Promise<User> {
    const response = await fetch(`${this.baseURL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ correo, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al iniciar sesión');
    }

    const data: LoginResponse = await response.json();
    
    // Guardar token en localStorage
    localStorage.setItem(this.tokenKey, data.data.token);
    
    return data.data.user;
  }

  async register(userData: {
    username: string;
    nombre: string;
    correo: string;
    password: string;
    telefono?: string;
  }): Promise<User> {
    const response = await fetch(`${this.baseURL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al registrar usuario');
    }

    const data: LoginResponse = await response.json();
    
    // Guardar token automáticamente después del registro
    localStorage.setItem(this.tokenKey, data.data.token);
    
    return data.data.user;
  }

  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem(this.tokenKey);
    
    if (!token) {
      return null;
    }

    try {
      const response = await fetch(`${this.baseURL}/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Token inválido, limpiar localStorage
        this.logout();
        return null;
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      this.logout();
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    window.location.href = '/';
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();
```

### organizacionAuthService.ts - Autenticación de Organizaciones

```typescript
interface Organizacion {
  id_organizacion: number;
  nombre: string;
  descripcion: string;
  nombre_representante: string;
  correo_representante: string;
  telefono_representante: string;
  sitio_web?: string;
  direccion?: string;
  estado: string;
}

class OrganizacionAuthService {
  private baseURL = 'http://localhost:3001/api/organizacion';
  private tokenKey = 'org_auth_token';

  async login(correoRepresentante: string, password: string): Promise<Organizacion> {
    const response = await fetch(`${this.baseURL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ correoRepresentante, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al iniciar sesión');
    }

    const data = await response.json();
    localStorage.setItem(this.tokenKey, data.data.token);
    return data.data.organizacion;
  }

  async register(orgData: {
    nombreOrganizacion: string;
    descripcion: string;
    nombreRepresentante: string;
    correoRepresentante: string;
    password: string;
    telefonoRepresentante: string;
    sitioWeb?: string;
    direccion?: string;
  }): Promise<Organizacion> {
    const response = await fetch(`${this.baseURL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orgData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al registrar organización');
    }

    const data = await response.json();
    localStorage.setItem(this.tokenKey, data.data.token);
    return data.data.organizacion;
  }

  // Métodos similares a authService pero para organizaciones
  // getCurrentOrganizacion(), logout(), etc.
}

export const organizacionAuthService = new OrganizacionAuthService();
```

## 🎨 Estilos y Temas

### Configuración de Tailwind

**Colores personalizados:**
```javascript
// tailwind.config.mjs
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
}
```

### Estilos Globales

**global.css:**
```css
/* Importar Tailwind */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Estilos personalizados */
@layer base {
  html {
    @apply scroll-smooth;
  }
  
  body {
    @apply bg-gray-50 text-gray-900;
  }
  
  h1, h2, h3, h4, h5, h6 {
    @apply font-semibold;
  }
}

@layer components {
  .btn-primary {
    @apply bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 
           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
           disabled:opacity-50 disabled:cursor-not-allowed;
  }
  
  .btn-secondary {
    @apply bg-gray-200 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-300
           focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2;
  }
  
  .form-input {
    @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
           focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500;
  }
  
  .form-label {
    @apply block text-sm font-medium text-gray-700 mb-1;
  }
  
  .card {
    @apply bg-white rounded-lg shadow-md p-6;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}

/* Animaciones personalizadas */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

/* Scrollbar personalizado */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
```

## 🐛 Resolución de Problemas

### Problemas Comunes

**Error: "Cannot read properties of undefined"**
```javascript
// Usar optional chaining
const userName = user?.nombre || 'Usuario';

// Verificar estado de carga
if (loading) return <div>Cargando...</div>;
if (!user) return <div>No autenticado</div>;
```

**Error de CORS en desarrollo**
```javascript
// Verificar que el backend esté configurado correctamente
// En el backend, asegurarse de tener:
app.use(cors({
  origin: 'http://localhost:4321',
  credentials: true
}));
```

**Componentes React no se hidratan**
```astro
<!-- Asegúrate de usar client:load o client:idle -->
<LoginForm client:load />

<!-- Para componentes que solo se usan en el cliente -->
<Dashboard client:only="react" />
```

**Estilos de Tailwind no se aplican**
```bash
# Verificar que el archivo esté en el content de Tailwind
# tailwind.config.mjs
content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}']

# Reconstruir estilos
npm run build
```

---

**¡El frontend está listo!** Ahora tienes una aplicación completa funcionando con autenticación de usuarios y organizaciones.
