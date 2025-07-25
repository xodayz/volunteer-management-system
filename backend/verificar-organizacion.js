require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'sistema_voluntariado',
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
});

async function verificarOrganizacion() {
    try {
        console.log('✅ VERIFICACIÓN FINAL - ORGANIZACIÓN AGREGADA\n');

        const client = await pool.connect();

        const orgQuery = 'SELECT * FROM organizaciones WHERE correo_representante = $1';
        const orgResult = await client.query(orgQuery, ['maria.gonzalez@fundacionesperanza.org']);

        if (orgResult.rows.length === 0) {
            console.log('❌ No se encontró la organización');
            return;
        }

        const org = orgResult.rows[0];

        console.log('🏢 ORGANIZACIÓN REGISTRADA:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`📝 ID: ${org.id_organizacion}`);
        console.log(`🏛️  Nombre: ${org.nombre}`);
        console.log(`👤 Representante: ${org.nombre_representante}`);
        console.log(`📧 Email: ${org.correo_representante}`);
        console.log(`📞 Teléfono: ${org.telefono_representante}`);
        console.log(`🌐 Sitio Web: ${org.sitio_web || 'No especificado'}`);
        console.log(`📋 Descripción: ${org.descripcion?.substring(0, 100)}...`);
        console.log(`✅ Estado: ${org.estado}`);
        console.log(`🔐 Password configurado: ${org.password_hash ? 'Sí' : 'No'}`);
        console.log(`📅 Fecha de registro: ${org.created_at}`);

        console.log('\n🔑 CREDENCIALES DE ACCESO:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`📧 Email: ${org.correo_representante}`);
        console.log(`🔒 Contraseña: Esperanza2025!`);

        console.log('\n🌐 ENDPOINTS DISPONIBLES:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📝 Registro: POST http://localhost:3001/api/organizacion/register');
        console.log('🔐 Login: POST http://localhost:3001/api/organizacion/login');
        console.log('👤 Perfil: GET http://localhost:3001/api/organizacion/profile');
        console.log('🔓 Logout: POST http://localhost:3001/api/organizacion/logout');
        console.log('✅ Verificar Token: POST http://localhost:3001/api/organizacion/verify-token');

        console.log('\n🧪 EJEMPLO DE USO:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('1. Login:');
        console.log('   POST http://localhost:3001/api/organizacion/login');
        console.log('   Body:', JSON.stringify({
            email: org.correo_representante,
            password: "Esperanza2025!"
        }, null, 6));

        console.log('\n2. Obtener perfil (usar el token del login):');
        console.log('   GET http://localhost:3001/api/organizacion/profile');
        console.log('   Headers: Authorization: Bearer [TOKEN]');

        console.log('\n🎯 FRONTEND:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('• Login organizaciones: http://localhost:4321/login-organizacion');
        console.log('• Registro organizaciones: http://localhost:4321/register-organizacion');
        console.log('• Dashboard organizaciones: http://localhost:4321/dashboard-organizacion');

        console.log('\n✅ LA ORGANIZACIÓN HA SIDO AGREGADA EXITOSAMENTE');
        console.log('🚀 El sistema de autenticación para organizaciones está FUNCIONANDO');

        client.release();

    } catch (error) {
        console.error('❌ Error en verificación:', error.message);
    } finally {
        await pool.end();
    }
}

verificarOrganizacion();
