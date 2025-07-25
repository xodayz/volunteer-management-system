require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'sistema_voluntariado',
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
});

async function actualizarOrganizacionConPassword() {
    try {
        console.log('🔐 Actualizando organización existente con contraseña...\n');

        const client = await pool.connect();
        console.log('✅ Conexión a la base de datos exitosa');

        const orgQuery = 'SELECT * FROM organizaciones WHERE correo_representante = $1';
        const orgResult = await client.query(orgQuery, ['maria.gonzalez@fundacionesperanza.org']);

        if (orgResult.rows.length === 0) {
            console.log('❌ No se encontró la organización');
            client.release();
            return;
        }

        const organizacion = orgResult.rows[0];
        console.log('📋 Organización encontrada:', organizacion.nombre);

        const password = 'Esperanza2025!';
        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const updateQuery = `
            UPDATE organizaciones 
            SET password_hash = $1, 
                sitio_web = $2,
                email_verificado = $3,
                updated_at = CURRENT_TIMESTAMP
            WHERE id_organizacion = $4
            RETURNING *
        `;

        const updateResult = await client.query(updateQuery, [
            passwordHash,
            'https://www.fundacionesperanza.org',
            false,
            organizacion.id_organizacion
        ]);

        const organizacionActualizada = updateResult.rows[0];

        console.log('✅ Organización actualizada exitosamente!');
        console.log('\n📋 Datos actualizados:');
        console.log(`   ID: ${organizacionActualizada.id_organizacion}`);
        console.log(`   Nombre: ${organizacionActualizada.nombre}`);
        console.log(`   Representante: ${organizacionActualizada.nombre_representante}`);
        console.log(`   Email: ${organizacionActualizada.correo_representante}`);
        console.log(`   Teléfono: ${organizacionActualizada.telefono_representante}`);
        console.log(`   Sitio Web: ${organizacionActualizada.sitio_web}`);
        console.log(`   Estado: ${organizacionActualizada.estado}`);
        console.log(`   Email verificado: ${organizacionActualizada.email_verificado}`);
        console.log(`   Última actualización: ${organizacionActualizada.updated_at}`);

        console.log('\n🔑 Credenciales de acceso:');
        console.log(`   Email: ${organizacionActualizada.correo_representante}`);
        console.log(`   Contraseña: ${password}`);

        console.log('\n🌐 Ahora puedes usar estos datos para hacer login en:');
        console.log('   POST http://localhost:3001/api/organizacion/login');
        console.log('\n📝 Ejemplo de petición:');
        console.log(JSON.stringify({
            email: organizacionActualizada.correo_representante,
            password: password
        }, null, 2));

        client.release();

    } catch (error) {
        console.error('❌ Error actualizando organización:', error.message);
        if (error.detail) {
            console.error('📋 Detalle:', error.detail);
        }
    } finally {
        await pool.end();
    }
}

actualizarOrganizacionConPassword();
