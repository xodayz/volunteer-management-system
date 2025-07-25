const pool = require('./src/config/database');

async function checkDatabaseAndTables() {
  let client;
  
  try {
    console.log('🔍 Verificando estado de la base de datos...\n');
    
    client = await pool.connect();
    console.log('✅ Conexión establecida exitosamente');
    
    const dbInfo = await client.query(`
      SELECT 
        current_database() as database_name,
        current_user as current_user,
        inet_server_addr() as server_address,
        inet_server_port() as server_port
    `);
    
    console.log('📊 Información de la conexión:');
    console.log(`   Base de datos: ${dbInfo.rows[0].database_name}`);
    console.log(`   Usuario: ${dbInfo.rows[0].current_user}`);
    console.log(`   Servidor: ${dbInfo.rows[0].server_address || 'localhost'}`);
    console.log(`   Puerto: ${dbInfo.rows[0].server_port || 'N/A'}\n`);
    
    const tablesQuery = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    const existingTables = tablesQuery.rows.map(row => row.table_name);
    const expectedTables = ['categorias_eventos', 'organizaciones', 'usuarios', 'eventos'];
    
    console.log('📋 Estado de las tablas:');
    
    if (existingTables.length === 0) {
      console.log('   ⚠️  No se encontraron tablas en la base de datos');
      console.log('   💡 Necesitas ejecutar el script database_script.sql');
    } else {
      console.log(`   ✅ Tablas encontradas (${existingTables.length}):`);
      existingTables.forEach(table => {
        console.log(`      - ${table}`);
      });
      
      const missingTables = expectedTables.filter(table => !existingTables.includes(table));
      if (missingTables.length > 0) {
        console.log(`\n   ⚠️  Tablas faltantes (${missingTables.length}):`);
        missingTables.forEach(table => {
          console.log(`      - ${table}`);
        });
      } else {
        console.log('   🎉 Todas las tablas principales están presentes');
      }
    }
    
    if (existingTables.length > 0) {
      console.log('\n📈 Información de registros:');
      
      for (const table of expectedTables) {
        if (existingTables.includes(table)) {
          try {
            const countResult = await client.query(`SELECT COUNT(*) as count FROM ${table}`);
            const count = countResult.rows[0].count;
            console.log(`   ${table}: ${count} registro(s)`);
          } catch (error) {
            console.log(`   ${table}: Error al contar registros`);
          }
        }
      }
    }
    
    const extensionsQuery = await client.query(`
      SELECT extname 
      FROM pg_extension 
      WHERE extname = 'uuid-ossp';
    `);
    
    console.log('\n🔧 Extensiones:');
    if (extensionsQuery.rows.length > 0) {
      console.log('   ✅ uuid-ossp está instalada');
    } else {
      console.log('   ⚠️  uuid-ossp no está instalada');
    }
    
  } catch (error) {
    console.error('❌ Error durante la verificación:');
    console.error(`   ${error.message}`);
    
    if (error.code === '3D000') {
      console.log('\n💡 La base de datos no existe. Para crearla, ejecuta:');
      console.log('   createdb sistema_voluntariado');
    }
    
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
    console.log('\n🔒 Conexión cerrada');
  }
}

checkDatabaseAndTables();
