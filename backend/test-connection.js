const pool = require('./src/config/database');

async function testDatabaseConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Conexión exitosa a PostgreSQL');
    
    const result = await client.query('SELECT NOW() as current_time, version() as postgres_version');
    console.log('📊 Información de la base de datos:');
    console.log('   Hora actual:', result.rows[0].current_time);
    console.log('   Versión de PostgreSQL:', result.rows[0].postgres_version);
    
    const dbCheck = await client.query('SELECT current_database() as database_name');
    console.log('   Base de datos actual:', dbCheck.rows[0].database_name);
    
    client.release();
    
    console.log('🎉 Todas las pruebas de conexión fueron exitosas!');
    
  } catch (error) {
    console.error('❌ Error en la conexión a la base de datos:');
    console.error('   Tipo de error:', error.name);
    console.error('   Mensaje:', error.message);
    
    if (error.code) {
      console.error('   Código de error:', error.code);
    }
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Sugerencias:');
      console.log('   - Verifica que PostgreSQL esté ejecutándose');
      console.log('   - Confirma que el puerto 5432 esté disponible');
      console.log('   - Revisa la configuración del host');
    } else if (error.code === '28P01') {
      console.log('\n💡 Sugerencias:');
      console.log('   - Verifica el usuario y contraseña en el archivo .env');
      console.log('   - Confirma que el usuario tenga permisos de conexión');
    } else if (error.code === '3D000') {
      console.log('\n💡 Sugerencias:');
      console.log('   - La base de datos "sistema_voluntariado" no existe');
      console.log('   - Crea la base de datos o verifica el nombre en .env');
    }
    
  } finally {
    await pool.end();
    console.log('\n🔒 Pool de conexiones cerrado');
  }
}

testDatabaseConnection();
