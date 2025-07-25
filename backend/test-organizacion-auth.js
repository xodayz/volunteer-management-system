const pool = require('./src/config/database');

async function testOrganizacionAuth() {
  try {
    console.log('🧪 Probando la autenticación de organizaciones...\n');

    console.log('📊 Verificando conexión a la base de datos...');
    const client = await pool.connect();
    console.log('✅ Conexión a la base de datos exitosa\n');

    console.log('🔍 Verificando estructura de la tabla organizaciones...');
    const tableQuery = `
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'organizaciones'
      ORDER BY ordinal_position;
    `;
    
    const tableResult = await client.query(tableQuery);
    
    if (tableResult.rows.length === 0) {
      console.log('❌ La tabla organizaciones no existe');
      console.log('📝 Ejecuta el script database_script.sql primero');
    } else {
      console.log('✅ Tabla organizaciones encontrada');
      console.log('📋 Estructura de la tabla:');
      tableResult.rows.forEach(row => {
        console.log(`   - ${row.column_name}: ${row.data_type} (${row.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
      });
    }

    const requiredColumns = [
      'password_hash', 
      'correo_representante', 
      'sitio_web', 
      'email_verificado', 
      'ultimo_acceso'
    ];
    
    const existingColumns = tableResult.rows.map(row => row.column_name);
    const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col));
    
    if (missingColumns.length > 0) {
      console.log(`\n⚠️  Columnas faltantes: ${missingColumns.join(', ')}`);
      console.log('📝 Ejecuta el script update_organizaciones.sql para actualizar la tabla');
    } else {
      console.log('\n✅ Todas las columnas requeridas están presentes');
    }

    client.release();

    console.log('\n🌐 Rutas disponibles para organizaciones:');
    console.log('   📝 POST /api/organizacion/register - Registro de organización');
    console.log('   🔐 POST /api/organizacion/login - Login de organización'); 
    console.log('   👤 GET /api/organizacion/profile - Obtener perfil (requiere token)');
    console.log('   🔓 POST /api/organizacion/logout - Logout (requiere token)');
    console.log('   ✅ POST /api/organizacion/verify-token - Verificar token');
    console.log('   🧪 GET /api/organizacion/test-auth - Prueba de autenticación');

    console.log('\n📋 Ejemplo de registro (POST /api/organizacion/register):');
    console.log(JSON.stringify({
      nombreOrganizacion: "Fundación Ejemplo",
      nombreRepresentante: "Juan Pérez",
      correoRepresentante: "representante@fundacion.com",
      password: "Password123",
      telefono: "+1234567890",
      sitioWeb: "https://www.fundacion.com",
      descripcion: "Una fundación dedicada a ayudar a la comunidad con diversas actividades de voluntariado y desarrollo social."
    }, null, 2));

    console.log('\n📋 Ejemplo de login (POST /api/organizacion/login):');
    console.log(JSON.stringify({
      email: "representante@fundacion.com",
      password: "Password123"
    }, null, 2));

    console.log('\n🎯 Para probar las rutas:');
    console.log('1. Asegúrate de que el servidor esté corriendo (npm run dev)');
    console.log('2. Usa Postman, curl o el frontend para hacer peticiones');
    console.log('3. El servidor debe estar disponible en http://localhost:3001');

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error.message);
  } finally {
    await pool.end();
  }
}

testOrganizacionAuth();
