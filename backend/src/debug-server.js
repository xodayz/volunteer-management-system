console.log('=== INICIANDO SERVIDOR SIMPLE PARA DEBUG ===');
const express = require('express');
console.log('Express cargado');

const cors = require('cors');
console.log('CORS cargado');

require('dotenv').config();
console.log('Dotenv configurado');

const app = express();
const PORT = process.env.PORT || 3001;

console.log('Configurando middleware básico...');

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:4321',
    credentials: true
}));

app.use(express.json());
console.log('Middleware configurado');

console.log('Configurando endpoints de prueba...');

app.get('/api/health', (req, res) => {
    res.json({ message: 'Backend funcionando', timestamp: new Date() });
});

console.log('Cargando rutas de organizacionAuth...');
try {
    const organizacionAuthRoutes = require('./routes/organizacionAuth');
    app.use('/api/organizacionAuth', organizacionAuthRoutes);
    console.log('✅ OrganizacionAuth cargado exitosamente');
} catch (error) {
    console.error('❌ Error en organizacionAuth:', error.message);
    console.error('Stack completo:', error.stack);
}

console.log('Configurando 404...');
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

console.log('Iniciando servidor...');
app.listen(PORT, () => {
    console.log(`🚀 Servidor funcionando en puerto ${PORT}`);
    console.log(`🏢 OrganizacionAuth: http://localhost:${PORT}/api/organizacionAuth`);
});

console.log('Servidor configurado completamente');
