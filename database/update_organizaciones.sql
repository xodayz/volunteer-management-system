-- Script para actualizar la tabla organizaciones existente
-- Ejecutar solo si la tabla ya existe y necesita ser actualizada

-- Añadir nuevas columnas si no existen
DO $$ 
BEGIN
    -- Verificar y añadir columna password_hash
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'organizaciones' AND column_name = 'password_hash') THEN
        ALTER TABLE organizaciones ADD COLUMN password_hash VARCHAR(255);
    END IF;

    -- Verificar y añadir columna sitio_web
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'organizaciones' AND column_name = 'sitio_web') THEN
        ALTER TABLE organizaciones ADD COLUMN sitio_web VARCHAR(200);
    END IF;

    -- Verificar y añadir columna email_verificado
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'organizaciones' AND column_name = 'email_verificado') THEN
        ALTER TABLE organizaciones ADD COLUMN email_verificado BOOLEAN DEFAULT FALSE;
    END IF;

    -- Verificar y añadir columna ultimo_acceso
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'organizaciones' AND column_name = 'ultimo_acceso') THEN
        ALTER TABLE organizaciones ADD COLUMN ultimo_acceso TIMESTAMP;
    END IF;
END $$;

-- Actualizar restricciones de columnas existentes
ALTER TABLE organizaciones 
    ALTER COLUMN nombre TYPE VARCHAR(100),
    ALTER COLUMN nombre_representante SET NOT NULL,
    ALTER COLUMN correo_representante TYPE VARCHAR(100),
    ALTER COLUMN correo_representante SET NOT NULL,
    ALTER COLUMN telefono_representante SET NOT NULL;

-- Añadir restricción UNIQUE al correo_representante si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'organizaciones' 
                   AND constraint_name = 'organizaciones_correo_representante_key') THEN
        ALTER TABLE organizaciones ADD CONSTRAINT organizaciones_correo_representante_key UNIQUE (correo_representante);
    END IF;
END $$;

-- Hacer password_hash NOT NULL solo para nuevos registros
-- (las organizaciones existentes sin password_hash se pueden manejar por separado)
ALTER TABLE organizaciones ALTER COLUMN password_hash SET NOT NULL;

COMMIT;
