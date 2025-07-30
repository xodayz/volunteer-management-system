const express = require('express');
const router = express.Router();
const EventoController = require('../controllers/EventoController');
const EventController = require('../controllers/EventController');
const { authenticateUser } = require('../middleware/userAuth');
const jwt = require('jsonwebtoken');

const verificarTokenOrganizacion = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de autenticación requerido'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.tipo !== 'organizacion') {
      return res.status(403).json({
        success: false,
        message: 'Solo las organizaciones pueden acceder a este recurso'
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
};

// Rutas públicas (sin autenticación)
router.get('/all', EventController.getAllEvents);
router.get('/categorias', EventController.getCategorias);

// Rutas para voluntarios (con autenticación de usuario)
router.post('/:id/register', authenticateUser, EventController.registerVolunteerToEvent);

// Aplicar middleware de organización para el resto de las rutas
router.use(verificarTokenOrganizacion);

router.post('/', EventoController.createEvento);

router.get('/', EventoController.getEventosByOrganizacion);

router.get('/:id', EventoController.getEventoById);

module.exports = router;
