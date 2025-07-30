// Script para actualizar la estructura de la tabla eventos

const pool = require('./src/config/database').default || require('./src/config/database');

async function updateEventTableStructure() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Actualizando estructura de la tabla eventos...\n');

    await client.query('BEGIN');

    // Verificar estructura actual
    const columns = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'eventos'
      AND column_name IN ('voluntarios_inscritos', 'requisitos');
    `);

    console.log('📋 Estructura actual de campos a corregir:');
    columns.rows.forEach(col => {
      console.log(`   ${col.column_name}: ${col.data_type}`);
    });

    // Corregir campo voluntarios_inscritos si es necesario
    const voluntariosColumn = columns.rows.find(col => col.column_name === 'voluntarios_inscritos');
    if (voluntariosColumn && voluntariosColumn.data_type === 'ARRAY') {
      console.log('\n🔧 Corrigiendo campo voluntarios_inscritos...');
      
      // Eliminar y recrear la columna
      await client.query('ALTER TABLE eventos DROP COLUMN IF EXISTS voluntarios_inscritos');
      await client.query('ALTER TABLE eventos ADD COLUMN voluntarios_inscritos INTEGER DEFAULT 0');
      
      console.log('✅ Campo voluntarios_inscritos corregido a INTEGER');
    }

    // Corregir campo requisitos si es necesario
    const requisitosColumn = columns.rows.find(col => col.column_name === 'requisitos');
    if (requisitosColumn && requisitosColumn.data_type === 'ARRAY') {
      console.log('\n🔧 Corrigiendo campo requisitos...');
      
      // Eliminar y recrear la columna
      await client.query('ALTER TABLE eventos DROP COLUMN IF EXISTS requisitos');
      await client.query('ALTER TABLE eventos ADD COLUMN requisitos TEXT');
      
      console.log('✅ Campo requisitos corregido a TEXT');
    }

    // Verificar que el estado_evento tenga valores apropiados
    await client.query(`
      ALTER TABLE eventos 
      ALTER COLUMN estado_evento SET DEFAULT 'activo'
    `);

    await client.query('COMMIT');

    console.log('\n✅ Estructura de la tabla eventos actualizada exitosamente!');

    // Verificar estructura final
    const finalColumns = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'eventos'
      ORDER BY ordinal_position;
    `);

    console.log('\n📋 Estructura final de la tabla eventos:');
    finalColumns.rows.forEach(col => {
      console.log(`   ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(NOT NULL)' : '(NULLABLE)'} ${col.column_default ? `DEFAULT ${col.column_default}` : ''}`);
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error al actualizar la estructura:', error);
  } finally {
    client.release();
    process.exit(0);
  }
}

// Ejecutar actualización
updateEventTableStructure();
