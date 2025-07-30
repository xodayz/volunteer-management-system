// Script para verificar y actualizar la estructura de la tabla eventos

const pool = require('./src/config/database').default || require('./src/config/database');

async function checkEventTableStructure() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Verificando estructura de la tabla eventos...\n');

    // Verificar si la tabla eventos existe
    const tableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'eventos'
      );
    `);

    if (!tableExists.rows[0].exists) {
      console.log('❌ La tabla eventos no existe. Creándola...');
      
      // Crear tabla eventos
      await client.query(`
        CREATE TABLE public.eventos (
          id_evento SERIAL PRIMARY KEY,
          nombre VARCHAR(100) NOT NULL,
          descripcion TEXT,
          id_organizacion INTEGER NOT NULL,
          fecha_inicio DATE NOT NULL,
          fecha_fin DATE NOT NULL,
          hora_inicio TIME NOT NULL,
          hora_fin TIME,
          direccion TEXT,
          id_categoria INTEGER NOT NULL,
          capacidad_maxima INTEGER DEFAULT 50,
          voluntarios_inscritos INTEGER DEFAULT 0,
          requisitos TEXT,
          estado_evento VARCHAR(20) DEFAULT 'activo',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (id_organizacion) REFERENCES organizaciones(id_organizacion),
          FOREIGN KEY (id_categoria) REFERENCES categorias_eventos(id_categoria)
        );
      `);
      
      console.log('✅ Tabla eventos creada exitosamente.');
    } else {
      console.log('✅ La tabla eventos existe.');
    }

    // Obtener estructura actual de la tabla
    const columns = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'eventos'
      ORDER BY ordinal_position;
    `);

    console.log('\n📋 Estructura actual de la tabla eventos:');
    columns.rows.forEach(col => {
      console.log(`   ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(NOT NULL)' : '(NULLABLE)'} ${col.column_default ? `DEFAULT ${col.column_default}` : ''}`);
    });

    // Verificar restricciones de clave foránea
    const foreignKeys = await client.query(`
      SELECT
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_name = 'eventos';
    `);

    console.log('\n🔗 Claves foráneas:');
    foreignKeys.rows.forEach(fk => {
      console.log(`   ${fk.column_name} -> ${fk.foreign_table_name}.${fk.foreign_column_name}`);
    });

    // Verificar datos de ejemplo
    const eventCount = await client.query('SELECT COUNT(*) FROM eventos');
    console.log(`\n📊 Eventos en la base de datos: ${eventCount.rows[0].count}`);

    const categoriaCount = await client.query('SELECT COUNT(*) FROM categorias_eventos');
    console.log(`📊 Categorías disponibles: ${categoriaCount.rows[0].count}`);

    const organizacionCount = await client.query('SELECT COUNT(*) FROM organizaciones');
    console.log(`📊 Organizaciones registradas: ${organizacionCount.rows[0].count}`);

    console.log('\n✅ Verificación de base de datos completada exitosamente!');

  } catch (error) {
    console.error('❌ Error al verificar la base de datos:', error);
  } finally {
    client.release();
    process.exit(0);
  }
}

// Ejecutar verificación
checkEventTableStructure();
