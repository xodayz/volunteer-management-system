const pool = require('./src/config/database');

async function showCategorias() {
  try {
    const result = await pool.query('SELECT * FROM categorias LIMIT 10');
    
    console.log('Categorías disponibles:');
    result.rows.forEach(cat => {
      console.log(`ID: ${cat.id_categoria}, Nombre: ${cat.nombre}`);
    });
    
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit();
  }
}

showCategorias();
