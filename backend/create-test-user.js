require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function createTestUser() {
  try {
    console.log('🔧 Creando usuario de prueba...');
    
    const hashedPassword = await bcrypt.hash('Test123456', 12);
    
    const query = `
      INSERT INTO usuarios (
        username, nombre, correo, password_hash, telefono, direccion, 
        interes_habilidades, fecha_nacimiento, rol_usuario
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9
      ) RETURNING id_usuario, username, nombre, correo, telefono, direccion, interes_habilidades
    `;
    
    const values = [
      'testuser',
      'Usuario Test',
      'test@test.com',  
      hashedPassword,
      '809-555-0123',
      'Santo Domingo, RD',
      '[1, 2]', // Medio Ambiente y Educación
      '1990-01-01',
      'voluntario'
    ];
    
    const result = await pool.query(query, values);
    console.log('✅ Usuario creado exitosamente:', result.rows[0]);
    
  } catch (error) {
    console.error('❌ Error creando usuario:', error);
  } finally {
    await pool.end();
  }
}

createTestUser();
