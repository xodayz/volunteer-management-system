const pool = require('./src/config/database');

async function setupCategorias() {
  try {
    // Crear tabla categorias
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categorias (
        id_categoria SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        descripcion TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Insertar categoría por defecto
    const existingCategory = await pool.query(`
      SELECT * FROM categorias WHERE nombre = 'Voluntariado General'
    `);
    
    if (existingCategory.rows.length === 0) {
      await pool.query(`
        INSERT INTO categorias (nombre, descripcion) 
        VALUES ('Voluntariado General', 'Categoría general para eventos de voluntariado')
      `);
    }
    
    console.log('Tabla categorias creada y categoría por defecto añadida');
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit();
  }
}

setupCategorias();
