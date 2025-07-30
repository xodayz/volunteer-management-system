const express = require('express');
const router = express.Router();
const EventoController = require('../controllers/EventoController');
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

router.use(verificarTokenOrganizacion);

router.post('/', EventoController.createEvento);

router.get('/', EventoController.getEventosByOrganizacion);

router.get('/:id', EventoController.getEventoById);

module.exports = router;
