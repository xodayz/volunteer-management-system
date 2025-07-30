const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth');
const organizacionAuthRoutes = require('./routes/organizacionAuth');
const eventosRoutes = require('./routes/eventos');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

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

app.use('/api/auth', authRoutes.default || authRoutes);
app.use('/api/organizacion', organizacionAuthRoutes);
app.use('/api/eventos', eventosRoutes);

app.get('/api/auth/test', (req, res) => {
    res.json({ message: 'Auth test working' });
});

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

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:4321'}`);
    console.log(`🏢 Organizaciones endpoint: http://localhost:${PORT}/api/organizacion`);
    console.log(`📅 Eventos endpoint: http://localhost:${PORT}/api/eventos`);
});

module.exports = app;
