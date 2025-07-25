# Documentación del Backend - Node.js/Express

Esta documentación cubre la instalación, configuración y uso del servidor backend del Sistema de Gestión de Voluntariado, construido con Node.js, Express y PostgreSQL.

## 📋 Tabla de Contenidos

- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Ejecución](#ejecución)
- [API Endpoints](#api-endpoints)
- [Modelos de Datos](#modelos-de-datos)
- [Autenticación](#autenticación)
- [Middleware](#middleware)
- [Testing](#testing)
- [Deployment](#deployment)
- [Resolución de Problemas](#resolución-de-problemas)

## 🔧 Requisitos Previos

Antes de configurar el backend, asegúrate de tener:

- **Node.js** 18.x o superior
- **npm** 9.x o superior  
- **PostgreSQL** 12.x o superior (configurado y ejecutándose)
- **Base de datos** `sistema_voluntariado` creada y con tablas

### Verificar Requisitos

```bash
# Verificar versiones
node --version    # debe ser >= 18.0.0
npm --version     # debe ser >= 9.0.0

# Verificar PostgreSQL
psql --version
psql -U postgres -d sistema_voluntariado -c "SELECT COUNT(*) FROM usuarios;"
```

## 📦 Instalación

### 1. Navegar al Directorio del Backend

```bash
cd sistema-voluntariado/backend
```

### 2. Instalar Dependencias

```bash
# Instalar todas las dependencias
npm install

# Verificar instalación
npm list --depth=0
```

### Dependencias Principales

**Producción:**
- `express` - Framework web para Node.js
- `pg` - Cliente PostgreSQL para Node.js
- `bcryptjs` - Encriptación de contraseñas
- `jsonwebtoken` - Autenticación JWT
- `express-validator` - Validación de datos
- `cors` - Manejo de CORS
- `helmet` - Seguridad HTTP
- `dotenv` - Variables de entorno
- `morgan` - Logger de requests
- `express-rate-limit` - Limitación de requests

**Desarrollo:**
- `nodemon` - Auto-restart del servidor
- `typescript` - Tipado estático
- `ts-node` - Ejecución directa de TypeScript
- `@types/*` - Definiciones de tipos

## ⚙️ Configuración

### 1. Variables de Entorno

Crear archivo `.env` en el directorio `backend/`:

```bash
# Copiar plantilla (si existe)
cp .env.example .env

# O crear nuevo archivo .env
touch .env
```

**Contenido del archivo `.env`:**

```env
# =================================
# CONFIGURACIÓN DE BASE DE DATOS
# =================================
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sistema_voluntariado
DB_USER=postgres
DB_PASSWORD=tu_password_postgresql

# =================================
# CONFIGURACIÓN JWT
# =================================
JWT_SECRET=tu_jwt_secret_muy_seguro_y_largo_minimo_64_caracteres
JWT_EXPIRES_IN=7d

# =================================
# CONFIGURACIÓN DEL SERVIDOR
# =================================
PORT=3001
NODE_ENV=development

# =================================
# CONFIGURACIÓN DE CORS
# =================================
FRONTEND_URL=http://localhost:4321

# =================================
# CONFIGURACIÓN DE RATE LIMITING
# =================================
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# =================================
# CONFIGURACIÓN DE EMAIL (Opcional)
# =================================
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_app_password
```

### 2. Configuración de Seguridad

**Generar JWT Secret seguro:**

```bash
# Opción 1: Usando Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Opción 2: Usando OpenSSL
openssl rand -hex 64

# Opción 3: Online (no recomendado para producción)
# Usar: https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx
```

### 3. Verificar Configuración de Base de Datos

```bash
# Probar conexión a la base de datos
npm run test-db

# Verificar estructura de la base de datos
npm run check-db
```

## 🏗️ Estructura del Proyecto

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Configuración de PostgreSQL
│   ├── controllers/
│   │   ├── AuthController.js    # Controlador de autenticación de usuarios
│   │   └── OrganizacionAuthController.js # Controlador de autenticación de organizaciones
│   ├── middleware/
│   │   └── auth.js              # Middleware de autenticación JWT
│   ├── models/
│   │   ├── User.js              # Modelo de usuario
│   │   ├── User.ts              # Definiciones TypeScript
│   │   └── Organizacion.js      # Modelo de organización
│   ├── routes/
│   │   └── auth.js              # Rutas de autenticación
│   ├── services/
│   │   ├── AuthService.js       # Lógica de negocio de usuarios
│   │   └── OrganizacionAuthService.js # Lógica de negocio de organizaciones
│   ├── utils/                   # Utilidades generales
│   └── index.js                 # Punto de entrada principal
├── test-connection.js           # Script de prueba de BD
├── check-database.js           # Script de verificación de BD
├── package.json                # Dependencias y scripts
├── tsconfig.json              # Configuración TypeScript
└── README.md                  # Esta documentación
```

### Descripción de Componentes

**Config:**
- `database.js` - Pool de conexiones PostgreSQL, configuración de BD

**Controllers:**
- Manejan requests HTTP y responses
- Validación de datos de entrada
- Llamadas a servicios de negocio

**Middleware:**
- `auth.js` - Verificación de tokens JWT
- Middleware de validación y seguridad

**Models:**
- Interacción directa con la base de datos
- Operaciones CRUD
- Mapeo de datos

**Services:**
- Lógica de negocio
- Procesamiento de datos
- Integración entre modelos

**Routes:**
- Definición de endpoints de API
- Aplicación de middleware
- Organización de rutas

## 🚀 Ejecución

### Scripts Disponibles

```bash
# Desarrollo (con auto-restart)
npm run dev

# Producción
npm start

# Build TypeScript (si aplica)
npm run build

# Pruebas de base de datos
npm run test-db
npm run check-db

# Pruebas específicas
npm run test-org-auth
```

### Iniciar en Modo Desarrollo

```bash
# Terminal 1: Iniciar backend
cd backend
npm run dev

# El servidor debería mostrar:
# Server running on port 3001
# Database connected successfully
```

### Verificar que el Servidor está Ejecutándose

```bash
# Verificar puerto
netstat -ano | findstr :3001

# Probar endpoint básico
curl http://localhost:3001/api/health
# O en PowerShell:
Invoke-RestMethod -Uri "http://localhost:3001/api/health" -Method GET
```

## 🔌 API Endpoints

### Autenticación de Usuarios (`/api/auth`)

#### POST `/api/auth/register`
Registrar nuevo voluntario.

**Body:**
```json
{
  "username": "juan_voluntario",
  "nombre": "Juan",
  "correo": "juan@example.com",
  "password": "password123",
  "telefono": "+1-809-555-0123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id_usuario": 1,
      "username": "juan_voluntario",
      "nombre": "Juan",
      "correo": "juan@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### POST `/api/auth/login`
Iniciar sesión de voluntario.

**Body:**
```json
{
  "correo": "juan@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "user": {
      "id_usuario": 1,
      "username": "juan_voluntario",
      "nombre": "Juan",
      "correo": "juan@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### GET `/api/auth/profile`
Obtener perfil del usuario autenticado.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id_usuario": 1,
    "username": "juan_voluntario",
    "nombre": "Juan",
    "correo": "juan@example.com",
    "telefono": "+1-809-555-0123",
    "fecha_registro": "2024-01-25"
  }
}
```

### Autenticación de Organizaciones (`/api/organizacion`)

#### POST `/api/organizacion/register`
Registrar nueva organización.

**Body:**
```json
{
  "nombreOrganizacion": "Fundación Ejemplo",
  "descripcion": "Una descripción detallada de la organización con más de 10 caracteres",
  "nombreRepresentante": "María González",
  "correoRepresentante": "maria@fundacion.org",
  "password": "password123",
  "telefonoRepresentante": "+1-809-555-7890"
}
```

#### POST `/api/organizacion/login`
Iniciar sesión de organización.

**Body:**
```json
{
  "correoRepresentante": "maria@fundacion.org",
  "password": "password123"
}
```

### Endpoints de Prueba

#### GET `/api/health`
Verificar estado del servidor.

**Response (200):**
```json
{
  "status": "OK",
  "timestamp": "2024-01-25T10:30:00.000Z",
  "uptime": 3600
}
```

## 📊 Modelos de Datos

### User.js - Modelo de Usuario

```javascript
// Métodos principales
User.findByEmail(email)          // Buscar por email
User.findByUsername(username)    // Buscar por username
User.create(userData)            // Crear nuevo usuario
User.updateLastAccess(userId)    // Actualizar último acceso
```

**Estructura de datos:**
```javascript
{
  id_usuario: Number,
  username: String,
  nombre: String,
  correo: String,
  password_hash: String,
  telefono: String,
  fecha_registro: Date,
  fecha_nacimiento: Date,
  genero: String,
  direccion: String,
  interes_habilidades: String,
  foto_perfil: String,
  rol_usuario: String,
  estado_cuenta: String,
  email_verificado: Boolean,
  ultimo_acceso: Date
}
```

### Organizacion.js - Modelo de Organización

```javascript
// Métodos principales
Organizacion.findByEmail(email)     // Buscar por email
Organizacion.create(orgData)        // Crear nueva organización
Organizacion.updateLastAccess(id)   // Actualizar último acceso
```

**Estructura de datos:**
```javascript
{
  id_organizacion: Number,
  nombre: String,
  descripcion: String,
  nombre_representante: String,
  correo_representante: String,
  password_hash: String,
  telefono_representante: String,
  sitio_web: String,
  direccion: String,
  estado: String,
  email_verificado: Boolean,
  ultimo_acceso: Date
}
```

## 🔐 Autenticación

### Sistema JWT

El sistema utiliza JSON Web Tokens para autenticación:

**Configuración:**
```javascript
const jwt = require('jsonwebtoken');

// Generar token
const token = jwt.sign(
  { 
    userId: user.id_usuario, 
    email: user.correo,
    type: 'user' // o 'organization'
  },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN }
);

// Verificar token
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

### Middleware de Autenticación

**auth.js:**
```javascript
// Verificar token en headers
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Token requerido' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};
```

### Encriptación de Contraseñas

```javascript
const bcrypt = require('bcryptjs');

// Encriptar contraseña
const saltRounds = 10;
const hashedPassword = await bcrypt.hash(password, saltRounds);

// Verificar contraseña
const isValidPassword = await bcrypt.compare(password, hashedPassword);
```

## 🛡️ Middleware

### Seguridad

```javascript
// helmet.js - Headers de seguridad
app.use(helmet());

// cors.js - Cross-Origin Resource Sharing
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// rate-limit.js - Limitación de requests
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests por IP
});
app.use('/api/', limiter);
```

### Validación

```javascript
// express-validator
const { body, validationResult } = require('express-validator');

// Validaciones de registro
const registerValidation = [
  body('correo').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('Contraseña mínimo 6 caracteres'),
  body('nombre').notEmpty().withMessage('Nombre requerido')
];
```

### Logging

```javascript
// morgan.js - Request logging
app.use(morgan('combined'));

// Logs personalizados
const logger = {
  info: (message) => console.log(`[INFO] ${new Date().toISOString()}: ${message}`),
  error: (message) => console.error(`[ERROR] ${new Date().toISOString()}: ${message}`)
};
```

## 🧪 Testing

### Pruebas de Conexión

```bash
# Probar conexión a base de datos
npm run test-db
```

**test-connection.js:**
```javascript
const { testConnection } = require('./src/config/database');

testConnection()
  .then(() => {
    console.log('✅ Conexión a la base de datos exitosa');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error de conexión:', error);
    process.exit(1);
  });
```

### Pruebas de API con cURL

```bash
# Registro de usuario
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_user",
    "nombre": "Test User",
    "correo": "test@example.com",
    "password": "password123"
  }'

# Login de usuario
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "correo": "test@example.com",
    "password": "password123"
  }'

# Perfil (con token)
curl -X GET http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Pruebas con PowerShell

```powershell
# Registro de organización
$body = @{
    nombreOrganizacion = "Test Org"
    descripcion = "Una descripción de prueba con más de 10 caracteres"
    nombreRepresentante = "Juan Test"
    correoRepresentante = "test@org.com"
    password = "password123"
    telefonoRepresentante = "+1-809-555-0000"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/api/organizacion/register" `
  -Method POST `
  -Body $body `
  -ContentType "application/json"
```

## 🚀 Deployment

### Variables de Entorno para Producción

```env
NODE_ENV=production
PORT=3001

# Base de datos de producción
DB_HOST=tu-servidor-postgres.com
DB_PORT=5432
DB_NAME=sistema_voluntariado_prod
DB_USER=prod_user
DB_PASSWORD=password_super_seguro

# JWT Secret fuerte
JWT_SECRET=jwt_secret_de_produccion_muy_largo_y_seguro
JWT_EXPIRES_IN=24h

# CORS para dominio de producción
FRONTEND_URL=https://tu-dominio.com
```

### Build para Producción

```bash
# Instalar solo dependencias de producción
npm ci --only=production

# Si hay TypeScript
npm run build

# Iniciar en producción
npm start
```

### PM2 (Recomendado para producción)

```bash
# Instalar PM2
npm install -g pm2

# Iniciar aplicación
pm2 start src/index.js --name "voluntariado-backend"

# Ver logs
pm2 logs voluntariado-backend

# Reiniciar
pm2 restart voluntariado-backend

# Configurar auto-inicio
pm2 startup
pm2 save
```

## 🐛 Resolución de Problemas

### Error: Puerto ya en uso

```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3001 | xargs kill -9
```

### Error: Cannot find module

```bash
# Limpiar cache e instalar
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Error: Database connection failed

```javascript
// Verificar variables de entorno
console.log('DB Config:', {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER
});

// Probar conexión manual
const { Pool } = require('pg');
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'sistema_voluntariado',
  user: 'postgres',
  password: 'tu_password'
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) console.error('Error:', err);
  else console.log('Conexión exitosa:', res.rows[0]);
  pool.end();
});
```

### Error: JWT Secret not defined

```bash
# Verificar archivo .env
cat .env | grep JWT_SECRET

# Si no existe, generar nuevo
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"
```

### Logs de Debug

```javascript
// Habilitar logs detallados
const debug = require('debug')('app:server');

// Usar en código
debug('Usuario autenticado:', req.user);
debug('Query ejecutado:', query);

// Ejecutar con logs
DEBUG=app:* npm run dev
```

### Verificación de Health Check

```bash
# Endpoint de health check
curl http://localhost:3001/api/health

# Debería retornar:
# {"status":"OK","timestamp":"...","uptime":...}
```

## 📊 Monitoreo y Logs

### Estructura de Logs

```javascript
// Logger personalizado
const logger = {
  info: (message, data = {}) => {
    console.log(JSON.stringify({
      level: 'info',
      timestamp: new Date().toISOString(),
      message,
      data
    }));
  },
  error: (message, error = {}) => {
    console.error(JSON.stringify({
      level: 'error',
      timestamp: new Date().toISOString(),
      message,
      error: error.message || error,
      stack: error.stack
    }));
  }
};
```

### Métricas de Performance

```javascript
// Middleware de timing
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('Request completed', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`
    });
  });
  
  next();
});
```

## 📞 Soporte

Para obtener ayuda:

1. Verificar logs del servidor
2. Revisar variables de entorno
3. Probar endpoints con herramientas como Postman
4. Consultar documentación de PostgreSQL
5. Verificar permisos de base de datos

---

**¡El backend está listo!** Ahora puedes proceder con la configuración del frontend.
