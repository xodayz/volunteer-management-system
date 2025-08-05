console.log('=== INICIANDO SERVIDOR COMPLETO ===');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

console.log('Configurando middleware...');

app.use(helmet());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde.',
});
app.use(limiter);

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:4321',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

console.log('Cargando rutas...');

console.log('PASO 1: Intentando cargar auth...');
try {
    const authRoutes = require('./routes/auth');
    app.use('/api/auth', authRoutes.default || authRoutes);
    console.log('✅ Rutas de auth cargadas');
} catch (error) {
    console.error('❌ Error cargando rutas de auth:', error.message);
}

console.log('PASO 2: Intentando cargar organizacionAuth...');
try {
    const organizacionAuthRoutes = require('./routes/organizacionAuth');
    app.use('/api/organizacionAuth', organizacionAuthRoutes);
    console.log('✅ Rutas de organizacionAuth cargadas');
} catch (error) {
    console.error('❌ Error cargando rutas de organizacionAuth:', error.message);
}

console.log('PASO 2.1: Intentando cargar organizacionProfile...');
try {
    const organizacionProfileRoutes = require('./routes/organizacionProfile');
    app.use('/api/organizacion', organizacionProfileRoutes);
    console.log('✅ Rutas de organizacionProfile cargadas');
} catch (error) {
    console.error('❌ Error cargando rutas de organizacionProfile:', error.message);
}

console.log('PASO 3: Intentando cargar eventos...');
try {
    const eventosRoutes = require('./routes/eventos');
    app.use('/api/eventos', eventosRoutes);
    console.log('✅ Rutas de eventos cargadas');
} catch (error) {
    console.error('❌ Error cargando rutas de eventos:', error.message);
}

console.log('PASO 4: Intentando cargar password...');
try {
    const passwordParameterizationRoutes = require('./routes/passwordParameterization');
    app.use('/api/password', passwordParameterizationRoutes);
    console.log('✅ Rutas de password cargadas');
} catch (error) {
    console.error('❌ Error cargando rutas de password:', error.message);
}

console.log('PASO 5: Todas las rutas procesadas');

console.log('Configurando endpoints...');

app.get('/api/health', (req, res) => {
    res.json({ message: 'Backend funcionando correctamente', timestamp: new Date() });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Error interno'
    });
});

app.use('*', (req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

console.log('Iniciando servidor en puerto', PORT);

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:4321'}`);
    console.log(`👤 Auth endpoint: http://localhost:${PORT}/api/auth`);
    console.log(`🏢 OrganizacionAuth endpoint: http://localhost:${PORT}/api/organizacionAuth`);
    console.log(`🏢 OrganizacionProfile endpoint: http://localhost:${PORT}/api/organizacion`);
    console.log(`🔐 Password endpoint: http://localhost:${PORT}/api/password`);
    console.log(`📅 Eventos endpoint: http://localhost:${PORT}/api/eventos`);
});

module.exports = app;