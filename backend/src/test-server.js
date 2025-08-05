console.log('=== INICIANDO SERVIDOR DE PRUEBA ===');
const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json());

console.log('Configurando rutas...');

app.get('/api/health', (req, res) => {
    console.log('Health endpoint llamado');
    res.json({ message: 'Backend funcionando correctamente', timestamp: new Date() });
});

app.post('/api/password/verify', (req, res) => {
    console.log('Password verify endpoint llamado');
    res.json({ message: 'Password endpoint working!', received: req.body });
});

app.post('/api/password/change', (req, res) => {
    console.log('Password change endpoint llamado');
    res.json({ message: 'Password change endpoint working!', received: req.body });
});

app.use('*', (req, res) => {
    console.log('404 para:', req.originalUrl);
    res.status(404).json({ message: 'Ruta no encontrada' });
});

console.log('Iniciando servidor...');
app.listen(PORT, () => {
    console.log(`Servidor de prueba corriendo en puerto ${PORT}`);
    console.log(`Health: http://localhost:${PORT}/api/health`);
    console.log(`Password verify: http://localhost:${PORT}/api/password/verify`);
    console.log(`Password change: http://localhost:${PORT}/api/password/change`);
});
