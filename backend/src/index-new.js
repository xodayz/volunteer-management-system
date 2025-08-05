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

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes.default || authRoutes);

const eventosRoutes = require('./routes/eventos');
app.use('/api/eventos', eventosRoutes);

const passwordParameterizationRoutes = require('./routes/passwordParameterization');
app.use('/api/password', passwordParameterizationRoutes);

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
    console.log(`🔐 Password endpoint: http://localhost:${PORT}/api/password`);
    console.log(`📅 Eventos endpoint: http://localhost:${PORT}/api/eventos`);
});

module.exports = app;
