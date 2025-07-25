# Sistema de Gestión de Voluntariado

Un sistema web completo para la gestión de voluntarios y organizaciones, desarrollado con tecnologías modernas como Node.js, PostgreSQL, y Astro.

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#descripción-del-proyecto)
- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Requisitos Previos](#requisitos-previos)
- [Instalación Rápida](#instalación-rápida)
- [Instalación Detallada](#instalación-detallada)
- [Configuración](#configuración)
- [Uso del Sistema](#uso-del-sistema)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [API Endpoints](#api-endpoints)
- [Contribución](#contribución)
- [Licencia](#licencia)

## 📖 Descripción del Proyecto

Este sistema permite gestionar voluntarios y organizaciones benéficas, facilitando:

- **Registro y autenticación** de usuarios y organizaciones
- **Gestión de eventos** de voluntariado
- **Sistema de inscripciones** a eventos
- **Panel de administración** para organizaciones
- **Gestión de perfiles** de voluntarios

## 🏗️ Arquitectura del Sistema

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Frontend    │────│     Backend     │────│    Database     │
│   (Astro+React) │    │   (Node.js)     │    │  (PostgreSQL)   │
│   Puerto: 4321  │    │   Puerto: 3001  │    │   Puerto: 5432  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Tecnologías Utilizadas

**Frontend:**
- [Astro](https://astro.build/) - Framework web moderno
- [React](https://reactjs.org/) - Componentes interactivos
- [TypeScript](https://www.typescriptlang.org/) - Tipado estático
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS

**Backend:**
- [Node.js](https://nodejs.org/) - Runtime de JavaScript
- [Express.js](https://expressjs.com/) - Framework web
- [JWT](https://jwt.io/) - Autenticación
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) - Encriptación de contraseñas

**Base de Datos:**
- [PostgreSQL](https://www.postgresql.org/) - Base de datos relacional

## 🔧 Requisitos Previos

Antes de instalar el sistema, asegúrate de tener instalado:

### Software Requerido

1. **Node.js** (versión 18 o superior)
   - Descargar desde: https://nodejs.org/
   - Verificar instalación: `node --version`

2. **npm** (incluido con Node.js)
   - Verificar instalación: `npm --version`

3. **PostgreSQL** (versión 12 o superior)
   - **Windows**: Descargar desde https://www.postgresql.org/download/windows/
   - **macOS**: `brew install postgresql`
   - **Linux**: `sudo apt-get install postgresql postgresql-contrib`

4. **Git** (opcional, para clonar el repositorio)
   - Descargar desde: https://git-scm.com/

### Herramientas Recomendadas

- **Visual Studio Code** - Editor de código
- **pgAdmin** - Interfaz gráfica para PostgreSQL
- **Postman** - Pruebas de API

## ⚡ Instalación Rápida

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/sistema-voluntariado.git
cd sistema-voluntariado

# 2. Configurar la base de datos (ver documentación detallada)
# Crear base de datos 'sistema_voluntariado'
# Ejecutar script: database/database_script.sql

# 3. Configurar backend
cd backend
npm install
cp .env.example .env  # Configurar variables de entorno
npm run dev

# 4. Configurar frontend (en otra terminal)
cd ../frontend
npm install
npm run dev
```

## 📚 Instalación Detallada

### 1. Base de Datos PostgreSQL

Consulta la [documentación detallada de la base de datos](./database/README.md) para:
- Instalación paso a paso de PostgreSQL
- Configuración inicial
- Ejecución de scripts
- Consultas básicas y administración

### 2. Backend (Node.js/Express)

Consulta la [documentación del backend](./backend/README.md) para:
- Configuración de variables de entorno
- Instalación de dependencias
- Estructura del código
- API endpoints disponibles

### 3. Frontend (Astro/React)

Consulta la [documentación del frontend](./frontend/README.md) para:
- Configuración del proyecto Astro
- Componentes React disponibles
- Estilos y temas
- Rutas y navegación

## ⚙️ Configuración

### Variables de Entorno

El sistema requiere las siguientes variables de entorno en el backend:

```env
# Base de datos
DB_USER=postgres
DB_PASSWORD=tu_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sistema_voluntariado

# JWT
JWT_SECRET=tu_jwt_secret_muy_seguro
JWT_EXPIRES_IN=7d

# Servidor
PORT=3001
NODE_ENV=development
```

### Puertos por Defecto

- **Frontend**: http://localhost:4321
- **Backend**: http://localhost:3001
- **PostgreSQL**: puerto 5432

## 🚀 Uso del Sistema

### Usuarios del Sistema

1. **Voluntarios**
   - Registro con datos personales
   - Búsqueda de eventos de voluntariado
   - Inscripción a eventos
   - Gestión de perfil

2. **Organizaciones**
   - Registro con datos institucionales
   - Creación y gestión de eventos
   - Administración de voluntarios inscritos
   - Panel de estadísticas

### Flujo de Trabajo Básico

1. **Registro**: Usuario u organización se registra en el sistema
2. **Autenticación**: Login con credenciales
3. **Navegación**: Acceso al dashboard correspondiente
4. **Gestión**: Crear eventos (organizaciones) o inscribirse (voluntarios)

## 📁 Estructura del Proyecto

```
sistema-voluntariado/
├── backend/                 # Servidor Node.js
│   ├── src/
│   │   ├── config/         # Configuración de BD
│   │   ├── controllers/    # Controladores de API
│   │   ├── middleware/     # Middleware personalizado
│   │   ├── models/         # Modelos de datos
│   │   ├── routes/         # Rutas de API
│   │   ├── services/       # Lógica de negocio
│   │   └── utils/          # Utilidades
│   ├── package.json
│   └── README.md
├── frontend/               # Cliente Astro/React
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── layouts/        # Layouts de Astro
│   │   ├── pages/          # Páginas del sitio
│   │   ├── services/       # Servicios de API
│   │   └── styles/         # Estilos CSS
│   ├── package.json
│   └── README.md
├── database/               # Scripts de BD
│   ├── database_script.sql # Script principal
│   └── README.md
└── README.md              # Este archivo
```

## 🔌 API Endpoints

### Autenticación de Usuarios
- `POST /api/auth/register` - Registro de voluntario
- `POST /api/auth/login` - Login de voluntario
- `GET /api/auth/profile` - Obtener perfil
- `POST /api/auth/logout` - Cerrar sesión

### Autenticación de Organizaciones
- `POST /api/organizacion/register` - Registro de organización
- `POST /api/organizacion/login` - Login de organización
- `GET /api/organizacion/profile` - Obtener perfil
- `POST /api/organizacion/logout` - Cerrar sesión

### Eventos (Próximamente)
- `GET /api/eventos` - Listar eventos
- `POST /api/eventos` - Crear evento
- `GET /api/eventos/:id` - Obtener evento específico
- `PUT /api/eventos/:id` - Actualizar evento
- `DELETE /api/eventos/:id` - Eliminar evento

## 🐛 Solución de Problemas

### Problemas Comunes

1. **Error de conexión a la base de datos**
   ```bash
   # Verificar que PostgreSQL esté ejecutándose
   pg_ctl status
   
   # Verificar variables de entorno
   echo $DB_PASSWORD
   ```

2. **Puerto ya en uso**
   ```bash
   # Matar proceso en puerto 3001
   netstat -ano | findstr :3001
   taskkill /PID <PID_NUMBER> /F
   ```

3. **Módulos no encontrados**
   ```bash
   # Reinstalar dependencias
   rm -rf node_modules package-lock.json
   npm install
   ```

## 📞 Soporte

Si encuentras problemas durante la instalación o uso del sistema:

1. Revisa la documentación específica de cada componente
2. Verifica que todos los requisitos previos estén instalados
3. Consulta la sección de solución de problemas
4. Abre un issue en el repositorio de GitHub

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

**¿Necesitas ayuda?** Consulta las documentaciones específicas de cada componente o contacta al equipo de desarrollo.
