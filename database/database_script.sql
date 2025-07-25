-- Crear extensiones útiles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla: categorias_eventos
CREATE TABLE categorias_eventos (
    id_categoria SERIAL PRIMARY KEY,
    nombre VARCHAR(30) NOT NULL,
    descripcion VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: organizaciones
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

-- Tabla: usuarios
CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    username VARCHAR(30) UNIQUE NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50),
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

-- Tabla: eventos
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
