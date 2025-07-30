const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function checkOrganizacionesTable() {
  try {
    console.log('🔍 Verificando la estructura de la tabla organizaciones...');
    
    // Consultar las columnas de la tabla organizaciones
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'organizaciones' 
      ORDER BY ordinal_position;
    `);
    
    console.log('\n📋 Columnas encontradas en la tabla organizaciones:');
    result.rows.forEach(row => {
      console.log(`- ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable}) ${row.column_default ? `(default: ${row.column_default})` : ''}`);
    });
    
    // Verificar si existe la columna dirección
    const columnNames = result.rows.map(row => row.column_name);
    
    console.log('\n✅ Verificando columna dirección:');
    if (columnNames.includes('direccion')) {
      console.log('✓ direccion - EXISTE');
    } else {
      console.log('❌ direccion - NO EXISTE');
      console.log('\n💡 Se necesita agregar la columna dirección a la tabla organizaciones');
    }
    
  } catch (error) {
    console.error('❌ Error verificando la estructura:', error);
  } finally {
    await pool.end();
  }
}

checkOrganizacionesTable();
