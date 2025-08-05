console.log('=== SERVIDOR ULTRA SIMPLE ===');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Ruta manual sin dependencias externas
app.post('/api/organizacionAuth/login', (req, res) => {
    console.log('LOGIN REQUEST RECEIVED:', req.body);
    res.json({ 
        success: false, 
        message: 'Endpoint manual funcionando - credenciales no válidas',
        data: req.body 
    });
});

app.get('/api/health', (req, res) => {
    res.json({ message: 'Servidor ultra simple funcionando' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor ultra simple en puerto ${PORT}`);
    console.log(`Test: http://localhost:${PORT}/api/organizacionAuth/login`);
});

console.log('Configuración completa');
