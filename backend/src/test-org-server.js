// SERVIDOR DE PRUEBA PARA ORGANIZACION AUTH
console.log('=== SERVIDOR PRUEBA ORGANIZACION AUTH ===');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3001;

// Middleware básico
app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/api/health', (req, res) => {
    res.json({ message: 'Servidor de prueba funcionando', timestamp: new Date() });
});

// Cargar rutas de organizacion
console.log('Cargando rutas de organizacionAuth...');
try {
    const organizacionAuthRoutes = require('./routes/organizacionAuth');
    app.use('/api/organizacionAuth', organizacionAuthRoutes);
    console.log('✅ Rutas de organizacionAuth cargadas correctamente');
} catch (error) {
    console.error('❌ Error cargando organizacionAuth:', error);
}

// Endpoint 404
app.use('*', (req, res) => {
    console.log('404 para:', req.originalUrl);
    res.status(404).json({ message: 'Ruta no encontrada', url: req.originalUrl });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor de prueba en puerto ${PORT}`);
    console.log(`🏢 OrganizacionAuth: http://localhost:${PORT}/api/organizacionAuth`);
});
