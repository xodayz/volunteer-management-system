const pool = require('./src/config/database');

async function showTableStructure() {
  try {
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'eventos' 
      ORDER BY ordinal_position
    `);
    
    console.log('Estructura de la tabla eventos:');
    result.rows.forEach(col => {
      console.log(`${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });
    
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit();
  }
}

showTableStructure();
