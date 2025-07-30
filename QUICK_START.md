# 🚀 Guía de Instalación Rápida

Esta guía te ayudará a tener el Sistema de Gestión de Voluntariado ejecutándose en menos de 15 minutos.

## ⚡ Instalación Express (Para desarrolladores experimentados)

```bash
# 1. Clonar repositorio
git clone <url-repositorio>
cd sistema-voluntariado

# 2. Instalar dependencias
cd backend && npm install && cd ../frontend && npm install && cd ..

# 3. Configurar PostgreSQL (ver sección completa abajo)
# 4. Configurar variables de entorno del backend
# 5. Ejecutar en paralelo
# Terminal 1: cd backend && npm run dev
# Terminal 2: cd frontend && npm run dev
```

## 📋 Checklist de Instalación Completa

### ✅ 1. Instalar PostgreSQL

**Windows:**
- Descargar de: https://www.postgresql.org/download/windows/
- Durante instalación, recordar contraseña del usuario `postgres`
- Puerto por defecto: 5432

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### ✅ 2. Configurar Base de Datos

```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE sistema_voluntariado;
\c sistema_voluntariado;

# Ejecutar script (ajustar ruta)
\i 'ruta/completa/al/database/database_script.sql'

# Verificar tablas
\dt
```

### ✅ 3. Configurar Backend

```bash
cd backend

# Instalar dependencias
npm install

# Copiar y configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de PostgreSQL

# Probar conexión a base de datos
npm run test-db

# Iniciar servidor
npm run dev
```

**Variables de entorno críticas (.env):**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sistema_voluntariado
DB_USER=postgres
DB_PASSWORD=tu_password
JWT_SECRET=secreto_muy_largo_y_seguro
PORT=3001
```

### ✅ 4. Configurar Frontend

```bash
# En nueva terminal
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### ✅ 5. Verificar Instalación

- **Backend**: http://localhost:3001/api/health
- **Frontend**: http://localhost:4321
- **Registro**: http://localhost:4321/register
- **Login**: http://localhost:4321/login

## 🔧 Comandos Útiles

### Backend
```bash
cd backend
npm run dev          # Servidor desarrollo
npm run test-db      # Probar conexión BD
npm run check-db     # Verificar estructura BD
```

### Frontend
```bash
cd frontend
npm run dev          # Servidor desarrollo
npm run build        # Build producción
npm run preview      # Preview build
```

### Base de Datos
```bash
# Conectar a PostgreSQL
psql -U postgres -d sistema_voluntariado

# Comandos útiles en psql
\dt                  # Listar tablas
\d usuarios          # Describir tabla usuarios
\q                   # Salir
```

## 🐛 Solución Rápida de Problemas

### Error: Puerto en uso
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3001 | xargs kill -9
```

### Error: No se puede conectar a PostgreSQL
```bash
# Verificar que PostgreSQL esté ejecutándose
# Windows
sc query postgresql-x64-15

# macOS
brew services list | grep postgresql

# Linux
sudo systemctl status postgresql
```

### Error: Token JWT inválido
```bash
# Generar nuevo JWT_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# Actualizar en .env
```

### Error: Módulos no encontrados
```bash
# Limpiar e instalar dependencias
rm -rf node_modules package-lock.json
npm install
```

## 🎯 Datos de Prueba

Una vez instalado, puedes usar estos datos para probar:

**Organización de prueba:**
- Email: maria@fundacionesperanza.org
- Password: password123

**Para crear un usuario:**
- Username: test_user
- Nombre: Usuario Prueba
- Email: test@example.com
- Password: password123

## 📚 Documentación Completa

- **General**: [README.md](./README.md)
- **Base de datos**: [database/README.md](./database/README.md)
- **Backend**: [backend/README.md](./backend/README.md)
- **Frontend**: [frontend/INSTALLATION.md](./frontend/INSTALLATION.md)

## 🆘 ¿Necesitas Ayuda?

1. **Verificar logs**: Revisar terminal para errores específicos
2. **Probar endpoints**: Usar Postman o curl para verificar API
3. **Verificar red**: DevTools del navegador > Network tab
4. **Consultar documentación**: Cada componente tiene documentación detallada

---

**¡Felicidades! 🎉** Tu sistema debería estar ejecutándose en:
- Frontend: http://localhost:4321
- Backend: http://localhost:3001
