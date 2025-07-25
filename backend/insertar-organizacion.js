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

async function insertarOrganizacion() {
    try {
        console.log('🏢 Agregando organización de ejemplo a la base de datos...\n');

        const client = await pool.connect();
        console.log('✅ Conexión a la base de datos exitosa');

        const tableCheck = await client.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'organizaciones'
            );
        `);

        if (!tableCheck.rows[0].exists) {
            console.log('❌ La tabla organizaciones no existe');
            console.log('📝 Ejecuta primero: npm run check-db');
            return;
        }

        const columns = await client.query(`
            SELECT column_name FROM information_schema.columns 
            WHERE table_name = 'organizaciones'
        `);
        
        const columnNames = columns.rows.map(row => row.column_name);
        console.log('📋 Columnas disponibles:', columnNames.join(', '));

        const organizacionData = {
            nombre: 'Fundación Esperanza',
            descripcion: 'Una organización sin fines de lucro dedicada a ayudar a comunidades vulnerables a través de programas de educación, salud y desarrollo sostenible.',
            nombreRepresentante: 'María Elena González',
            correoRepresentante: 'maria.gonzalez@fundacionesperanza.org',
            password: 'Esperanza2025!',
            telefono: '+1-809-555-0123',
            sitioWeb: 'https://www.fundacionesperanza.org'
        };

        const existingOrg = await client.query(
            'SELECT * FROM organizaciones WHERE correo_representante = $1',
            [organizacionData.correoRepresentante]
        );

        if (existingOrg.rows.length > 0) {
            console.log('⚠️  Ya existe una organización con este correo electrónico');
            console.log('📧 Correo:', organizacionData.correoRepresentante);
            
            const org = existingOrg.rows[0];
            console.log('\n📋 Organización existente:');
            console.log(`   ID: ${org.id_organizacion}`);
            console.log(`   Nombre: ${org.nombre}`);
            console.log(`   Representante: ${org.nombre_representante}`);
            console.log(`   Email: ${org.correo_representante}`);
            console.log(`   Teléfono: ${org.telefono_representante}`);
            console.log(`   Estado: ${org.estado}`);
            console.log(`   Creado: ${org.created_at}`);
            
            client.release();
            return;
        }

        console.log('🔐 Encriptando contraseña...');
        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(organizacionData.password, saltRounds);

        console.log('💾 Insertando organización en la base de datos...');
        
        let query, values;
        
        const hasPasswordHash = columnNames.includes('password_hash');
        const hasSitioWeb = columnNames.includes('sitio_web');
        
        if (hasPasswordHash && hasSitioWeb) {
            query = `
                INSERT INTO organizaciones (
                    nombre, 
                    descripcion, 
                    nombre_representante, 
                    correo_representante, 
                    password_hash, 
                    telefono_representante, 
                    sitio_web
                ) 
                VALUES ($1, $2, $3, $4, $5, $6, $7) 
                RETURNING *
            `;
            
            values = [
                organizacionData.nombre,
                organizacionData.descripcion,
                organizacionData.nombreRepresentante,
                organizacionData.correoRepresentante,
                passwordHash,
                organizacionData.telefono,
                organizacionData.sitioWeb
            ];
        } else {
            query = `
                INSERT INTO organizaciones (
                    nombre, 
                    descripcion, 
                    nombre_representante, 
                    correo_representante, 
                    telefono_representante
                ) 
                VALUES ($1, $2, $3, $4, $5) 
                RETURNING *
            `;
            
            values = [
                organizacionData.nombre,
                organizacionData.descripcion,
                organizacionData.nombreRepresentante,
                organizacionData.correoRepresentante,
                organizacionData.telefono
            ];
        }

        const result = await client.query(query, values);
        const nuevaOrganizacion = result.rows[0];

        console.log('✅ Organización agregada exitosamente!');
        console.log('\n📋 Datos de la organización:');
        console.log(`   ID: ${nuevaOrganizacion.id_organizacion}`);
        console.log(`   Nombre: ${nuevaOrganizacion.nombre}`);
        console.log(`   Representante: ${nuevaOrganizacion.nombre_representante}`);
        console.log(`   Email: ${nuevaOrganizacion.correo_representante}`);
        console.log(`   Teléfono: ${nuevaOrganizacion.telefono_representante}`);
        console.log(`   Estado: ${nuevaOrganizacion.estado}`);
        if (nuevaOrganizacion.sitio_web) {
            console.log(`   Sitio Web: ${nuevaOrganizacion.sitio_web}`);
        }
        console.log(`   Fecha de creación: ${nuevaOrganizacion.created_at}`);

        if (hasPasswordHash) {
            console.log('\n🔑 Datos de acceso:');
            console.log(`   Email: ${organizacionData.correoRepresentante}`);
            console.log(`   Contraseña: ${organizacionData.password}`);
            console.log('\n🌐 Puedes usar estos datos para hacer login en:');
            console.log('   POST http://localhost:3001/api/organizacion/login');
        } else {
            console.log('\n⚠️  La tabla no tiene campos de autenticación');
            console.log('📝 Ejecuta el script update_organizaciones.sql para habilitar login');
        }

        client.release();

    } catch (error) {
        console.error('❌ Error agregando organización:', error.message);
        if (error.detail) {
            console.error('📋 Detalle:', error.detail);
        }
    } finally {
        await pool.end();
    }
}

insertarOrganizacion();
