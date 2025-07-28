# Documentación de la Base de Datos - PostgreSQL

Esta documentación proporciona una guía completa para la instalación, configuración y uso de la base de datos PostgreSQL del Sistema de Gestión de Voluntariado.

## 📋 Tabla de Contenidos

- [Instalación de PostgreSQL](#instalación-de-postgresql)
- [Configuración Inicial](#configuración-inicial)
- [Creación de la Base de Datos](#creación-de-la-base-de-datos)
- [Ejecución de Scripts](#ejecución-de-scripts)
- [Estructura de Tablas](#estructura-de-tablas)
- [Consultas Básicas](#consultas-básicas)
- [Administración y Mantenimiento](#administración-y-mantenimiento)
- [Resolución de Problemas](#resolución-de-problemas)

## 🔧 Instalación de PostgreSQL

### Windows

1. **Descargar PostgreSQL:**
   - Visita: https://www.postgresql.org/download/windows/
   - Descarga la versión más reciente (recomendado: 15.x o superior)

2. **Ejecutar el Instalador:**
   ```
   - Ejecuta el archivo descargado como administrador
   - Acepta la licencia
   - Selecciona el directorio de instalación (por defecto: C:\Program Files\PostgreSQL\15)
   - Selecciona componentes a instalar (todos recomendados):
     ✓ PostgreSQL Server
     ✓ pgAdmin 4
     ✓ Stack Builder
     ✓ Command Line Tools
   ```

3. **Configuración durante la instalación:**
   ```
   - Puerto: 5432 (por defecto)
   - Locale: [Default locale] o Spanish_Spain.1252
   - Contraseña del superusuario (postgres): [ANOTA ESTA CONTRASEÑA]
   ```

4. **Verificar la instalación:**
   ```cmd
   # Abrir PowerShell como administrador
   psql --version
   ```

### macOS

```bash
# Usando Homebrew (recomendado)
brew install postgresql

# Iniciar el servicio
brew services start postgresql

# Verificar instalación
psql --version
```

### Linux (Ubuntu/Debian)

```bash
# Actualizar paquetes
sudo apt update

# Instalar PostgreSQL
sudo apt install postgresql postgresql-contrib

# Iniciar el servicio
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verificar instalación
psql --version
```

## ⚙️ Configuración Inicial

### 1. Configurar Usuario Postgres

**Windows:**
```cmd
# Abrir PowerShell como administrador
# Cambiar a usuario postgres
psql -U postgres

# En el prompt de PostgreSQL:
\password postgres
# Ingresa nueva contraseña cuando se solicite
```

**macOS/Linux:**
```bash
# Cambiar a usuario postgres
sudo -i -u postgres

# Configurar contraseña
psql
\password postgres
```

### 2. Configurar Acceso Remoto (Opcional)

Editar archivo `postgresql.conf`:

**Windows:** `C:\Program Files\PostgreSQL\15\data\postgresql.conf`

```conf
# Permitir conexiones externas
listen_addresses = '*'
port = 5432
```

Editar archivo `pg_hba.conf`:

```conf
# Permitir conexiones locales con contraseña
host    all             all             127.0.0.1/32            md5
host    all             all             ::1/128                 md5
```

### 3. Reiniciar Servicio

**Windows:**
```cmd
# En Servicios de Windows, reiniciar "postgresql-x64-15"
# O desde PowerShell como administrador:
net stop postgresql-x64-15
net start postgresql-x64-15
```

**macOS/Linux:**
```bash
sudo systemctl restart postgresql
```

## 🗄️ Creación de la Base de Datos

### 1. Conectar a PostgreSQL

```bash
# Conectar como usuario postgres
psql -U postgres -h localhost
```

### 2. Crear Base de Datos

```sql
-- Crear la base de datos del sistema
CREATE DATABASE sistema_voluntariado
    WITH 
    ENCODING = 'UTF8'
    LC_COLLATE = 'es_ES.UTF-8'
    LC_CTYPE = 'es_ES.UTF-8'
    TEMPLATE = template0;

-- Verificar creación
\l

-- Conectar a la nueva base de datos
\c sistema_voluntariado;
```

### 3. Crear Usuario de Aplicación (Recomendado)

```sql
-- Crear usuario específico para la aplicación
CREATE USER voluntariado_user WITH ENCRYPTED PASSWORD 'tu_password_seguro';

-- Otorgar permisos
GRANT ALL PRIVILEGES ON DATABASE sistema_voluntariado TO voluntariado_user;
GRANT ALL ON SCHEMA public TO voluntariado_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO voluntariado_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO voluntariado_user;

-- Para permisos futuros
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO voluntariado_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO voluntariado_user;
```

## 📜 Ejecución de Scripts

### 1. Ejecutar Script Principal

**Método 1: Desde psql**
```bash
# Conectar a la base de datos
psql -U postgres -d sistema_voluntariado

# Ejecutar script
\i 'C:/ruta/completa/al/database_script.sql'
```

**Método 2: Desde línea de comandos**
```bash
# Windows
psql -U postgres -d sistema_voluntariado -f "C:\Users\dayha\OneDrive\Escritorio\Carpetas\UNPHU\sistema-voluntariado\database\database_script.sql"

# macOS/Linux
psql -U postgres -d sistema_voluntariado -f "/ruta/al/database_script.sql"
```

### 2. Verificar Ejecución

```sql
-- Conectar a la base de datos
\c sistema_voluntariado;

-- Listar todas las tablas
\dt

-- Verificar estructura de cada tabla
\d categorias_eventos
\d organizaciones
\d usuarios
\d eventos
```

### 3. Insertar Datos de Prueba

```sql
-- Insertar categorías de eventos
INSERT INTO categorias_eventos (nombre, descripcion) VALUES
('Educación', 'Eventos relacionados con educación y capacitación'),
('Medio Ambiente', 'Actividades de conservación y cuidado ambiental'),
('Salud', 'Campañas de salud y bienestar comunitario'),
('Asistencia Social', 'Ayuda a comunidades vulnerables');

-- Insertar organización de prueba
INSERT INTO organizaciones (
    nombre, descripcion, nombre_representante, 
    correo_representante, password_hash, telefono_representante
) VALUES (
    'Fundación Esperanza',
    'Organización dedicada a la educación comunitaria y desarrollo social',
    'María González',
    'maria@fundacionesperanza.org',
    '$2b$10$ejemplo.hash.password',
    '+1-809-555-0123'
);

-- Insertar usuario de prueba
INSERT INTO usuarios (
    username, nombre, correo, password_hash, telefono
) VALUES (
    'juan_voluntario',
    'Juan Pérez',
    'juan.perez@email.com',
    '$2b$10$ejemplo.hash.password',
    '+1-809-555-0456'
);
```

## 🏗️ Estructura de Tablas

### 1. Tabla: categorias_eventos
```sql
-- Categorías para clasificar eventos
CREATE TABLE categorias_eventos (
    id_categoria SERIAL PRIMARY KEY,
    nombre VARCHAR(30) NOT NULL,
    descripcion VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Campos:**
- `id_categoria`: ID único (auto-incrementable)
- `nombre`: Nombre de la categoría (máx. 30 caracteres)
- `descripcion`: Descripción opcional (máx. 100 caracteres)
- `created_at`, `updated_at`: Timestamps automáticos

### 2. Tabla: organizaciones
```sql
-- Organizaciones que crean eventos
CREATE TABLE organizaciones (
    id_organizacion SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    nombre_representante VARCHAR(50) NOT NULL,
    correo_representante VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    telefono_representante VARCHAR(15) NOT NULL,
    sitio_web VARCHAR(200),
    direccion TEXT,
    estado VARCHAR(20) DEFAULT 'activa',
    email_verificado BOOLEAN DEFAULT FALSE,
    ultimo_acceso TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Campos Importantes:**
- `correo_representante`: Email único para autenticación
- `password_hash`: Contraseña encriptada (bcrypt)
- `estado`: 'activa', 'inactiva', 'suspendida'
- `email_verificado`: Estado de verificación de email

### 3. Tabla: usuarios
```sql
-- Voluntarios del sistema
CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    username VARCHAR(30) UNIQUE NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    telefono VARCHAR(15),
    fecha_registro DATE NOT NULL DEFAULT CURRENT_DATE,
    fecha_nacimiento DATE,
    genero VARCHAR(20),
    direccion TEXT,
    interes_habilidades TEXT,
    foto_perfil VARCHAR(255),
    rol_usuario VARCHAR(20) DEFAULT 'voluntario',
    estado_cuenta VARCHAR(20) DEFAULT 'activa',
    email_verificado BOOLEAN DEFAULT FALSE,
    ultimo_acceso TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Tabla: eventos
```sql
-- Eventos de voluntariado
CREATE TABLE eventos (
    id_evento SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    id_organizacion INTEGER NOT NULL REFERENCES organizaciones(id_organizacion),
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME,
    ubicacion VARCHAR(100),
    direccion TEXT,
    id_categoria INTEGER NOT NULL REFERENCES categorias_eventos(id_categoria),
    capacidad_maxima INTEGER DEFAULT 50,
    voluntarios_inscritos INTEGER DEFAULT 0,
    requisitos TEXT,
    beneficios TEXT,
    estado_evento VARCHAR(20) DEFAULT 'planificado',
    coordinador_id INTEGER REFERENCES usuarios(id_usuario),
    imagen_evento VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 📊 Consultas Básicas

### Consultas de Selección

```sql
-- 1. Listar todas las organizaciones activas
SELECT 
    nombre,
    correo_representante,
    telefono_representante,
    estado
FROM organizaciones 
WHERE estado = 'activa'
ORDER BY nombre;

-- 2. Buscar usuarios registrados en el último mes
SELECT 
    username,
    nombre,
    correo,
    fecha_registro
FROM usuarios 
WHERE fecha_registro >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY fecha_registro DESC;

-- 3. Eventos próximos con información de organización
SELECT 
    e.nombre AS evento,
    e.fecha_inicio,
    e.fecha_fin,
    o.nombre AS organizacion,
    c.nombre AS categoria,
    e.capacidad_maxima,
    e.voluntarios_inscritos
FROM eventos e
JOIN organizaciones o ON e.id_organizacion = o.id_organizacion
JOIN categorias_eventos c ON e.id_categoria = c.id_categoria
WHERE e.fecha_inicio >= CURRENT_DATE
ORDER BY e.fecha_inicio;

-- 4. Estadísticas por categoría de evento
SELECT 
    c.nombre AS categoria,
    COUNT(e.id_evento) AS total_eventos,
    SUM(e.voluntarios_inscritos) AS total_voluntarios
FROM categorias_eventos c
LEFT JOIN eventos e ON c.id_categoria = e.id_categoria
GROUP BY c.id_categoria, c.nombre
ORDER BY total_eventos DESC;
```

### Consultas de Inserción

```sql
-- Insertar nueva organización
INSERT INTO organizaciones (
    nombre, descripcion, nombre_representante, 
    correo_representante, password_hash, telefono_representante
) VALUES (
    'Cruz Roja Dominicana',
    'Organización humanitaria internacional',
    'Dr. Pedro Martínez',
    'pedro@cruzroja.do',
    '$2b$10$XxXxXxXxXxXxXxXxXxXxXx',
    '+1-809-555-7890'
);

-- Insertar nuevo evento
INSERT INTO eventos (
    nombre, descripcion, id_organizacion, fecha_inicio, fecha_fin,
    hora_inicio, ubicacion, id_categoria
) VALUES (
    'Campaña de Vacunación Comunitaria',
    'Jornada de vacunación gratuita para niños y adultos mayores',
    1, -- ID de la organización
    '2024-02-15',
    '2024-02-15',
    '08:00:00',
    'Centro Comunitario Los Alcarrizos',
    3 -- ID de categoría 'Salud'
);
```

### Consultas de Actualización

```sql
-- Actualizar información de usuario
UPDATE usuarios 
SET 
    telefono = '+1-809-555-9999',
    direccion = 'Av. Winston Churchill #123, Santo Domingo',
    ultimo_acceso = CURRENT_TIMESTAMP
WHERE correo = 'juan.perez@email.com';

-- Incrementar contador de voluntarios inscritos
UPDATE eventos 
SET voluntarios_inscritos = voluntarios_inscritos + 1
WHERE id_evento = 1;

-- Cambiar estado de organización
UPDATE organizaciones 
SET estado = 'verificada', email_verificado = TRUE
WHERE correo_representante = 'maria@fundacionesperanza.org';
```

### Consultas de Eliminación

```sql
-- Eliminar evento cancelado (cuidado con integridad referencial)
DELETE FROM eventos 
WHERE id_evento = 5 AND estado_evento = 'cancelado';

-- Eliminar usuario inactivo
DELETE FROM usuarios 
WHERE estado_cuenta = 'eliminada' 
  AND ultimo_acceso < CURRENT_DATE - INTERVAL '365 days';
```

## 🔧 Administración y Mantenimiento

### Comandos de Administración psql

```sql
-- Comandos útiles de psql
\l              -- Listar bases de datos
\c database     -- Conectar a base de datos
\dt             -- Listar tablas
\d tabla        -- Describir estructura de tabla
\du             -- Listar usuarios
\q              -- Salir de psql

-- Información del sistema
SELECT version();           -- Versión de PostgreSQL
SELECT current_database();  -- Base de datos actual
SELECT current_user;        -- Usuario actual
```

### Backup y Restauración

```bash
# Crear backup completo
pg_dump -U postgres -h localhost sistema_voluntariado > backup_$(date +%Y%m%d).sql

# Crear backup solo de datos
pg_dump -U postgres -h localhost --data-only sistema_voluntariado > datos_backup.sql

# Restaurar desde backup
psql -U postgres -h localhost sistema_voluntariado < backup_20240125.sql
```

### Optimización y Índices

```sql
-- Crear índices para mejorar rendimiento
CREATE INDEX idx_eventos_fecha ON eventos(fecha_inicio);
CREATE INDEX idx_usuarios_email ON usuarios(correo);
CREATE INDEX idx_organizaciones_estado ON organizaciones(estado);

-- Analizar estadísticas de tablas
ANALYZE usuarios;
ANALYZE organizaciones;
ANALYZE eventos;

-- Verificar uso de índices
EXPLAIN ANALYZE SELECT * FROM eventos WHERE fecha_inicio >= CURRENT_DATE;
```

### Monitoreo de Performance

```sql
-- Ver consultas activas
SELECT pid, query, state FROM pg_stat_activity WHERE state = 'active';

-- Estadísticas de uso de tablas
SELECT 
    tablename,
    n_tup_ins AS inserts,
    n_tup_upd AS updates,
    n_tup_del AS deletes,
    seq_scan,
    seq_tup_read,
    idx_scan,
    idx_tup_fetch
FROM pg_stat_user_tables
ORDER BY seq_scan DESC;
```

## 🐛 Resolución de Problemas

### Problemas de Conexión

**Error: "could not connect to server"**
```bash
# Verificar que PostgreSQL esté ejecutándose
# Windows:
sc query postgresql-x64-15

# macOS/Linux:
sudo systemctl status postgresql

# Iniciar servicio si está detenido
# Windows:
net start postgresql-x64-15

# macOS/Linux:
sudo systemctl start postgresql
```

**Error: "authentication failed"**
```sql
-- Verificar configuración de usuario
\du

-- Cambiar contraseña
ALTER USER postgres PASSWORD 'nueva_password';
```

### Problemas de Permisos

```sql
-- Otorgar permisos completos a usuario
GRANT ALL PRIVILEGES ON DATABASE sistema_voluntariado TO usuario;
GRANT ALL ON SCHEMA public TO usuario;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO usuario;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO usuario;
```

### Problemas de Codificación

```sql
-- Verificar codificación de la base de datos
SELECT datname, encoding, datcollate, datctype FROM pg_database WHERE datname = 'sistema_voluntariado';

-- Si hay problemas, recrear con codificación correcta
DROP DATABASE IF EXISTS sistema_voluntariado;
CREATE DATABASE sistema_voluntariado 
    WITH ENCODING = 'UTF8' 
    LC_COLLATE = 'es_ES.UTF-8' 
    LC_CTYPE = 'es_ES.UTF-8';
```

### Limpieza y Mantenimiento

```sql
-- Limpiar logs antiguos
SELECT pg_rotate_logfile();

-- Vacuum para optimizar espacio
VACUUM ANALYZE;

-- Reindexar base de datos
REINDEX DATABASE sistema_voluntariado;
```

## 📱 Herramientas Gráficas

### pgAdmin 4

1. **Abrir pgAdmin**: Buscar en el menú de inicio o ir a http://localhost:pgadmin_port
2. **Conectar servidor**: 
   - Host: localhost
   - Puerto: 5432
   - Usuario: postgres
   - Contraseña: [tu contraseña]
3. **Navegar**: Servers > PostgreSQL > Databases > sistema_voluntariado

### DBeaver (Alternativa gratuita)

1. **Descargar**: https://dbeaver.io/download/
2. **Nueva conexión**: PostgreSQL
3. **Configurar**:
   - Host: localhost
   - Puerto: 5432
   - Base de datos: sistema_voluntariado
   - Usuario: postgres

## 📞 Soporte Adicional

Si encuentras problemas específicos:

1. **Logs de PostgreSQL**:
   - Windows: `C:\Program Files\PostgreSQL\15\data\log\`
   - Linux: `/var/log/postgresql/`

2. **Comandos de diagnóstico**:
   ```sql
   SELECT * FROM pg_stat_activity;
   SELECT * FROM pg_locks;
   ```

3. **Documentación oficial**: https://www.postgresql.org/docs/

---

**¡La base de datos está lista!** Ahora puedes proceder con la configuración del backend.
