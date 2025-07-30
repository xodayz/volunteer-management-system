const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'sistema_voluntariado',
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
});

const testConnection = async () => {
    try {
        const client = await pool.connect();
        console.log('✅ Conexión a la base de datos exitosa');
        client.release();
        return true;
    } catch (error) {
        console.error('❌ Error conectando a la base de datos:', error);
        return false;
    }
};

module.exports = pool;
module.exports.testConnection = testConnection;
