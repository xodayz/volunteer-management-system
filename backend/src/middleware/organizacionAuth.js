const jwt = require('jsonwebtoken');
const { OrganizacionModel } = require('../models/Organizacion');

const verificarTokenOrganizacion = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de acceso requerido'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    if (decoded.tipo !== 'organizacion') {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado: Token de organización requerido'
      });
    }

    const organizacion = await OrganizacionModel.findById(decoded.id);

    if (!organizacion) {
      return res.status(401).json({
        success: false,
        message: 'Organización no encontrada'
      });
    }

    if (organizacion.estado !== 'activa') {
      return res.status(403).json({
        success: false,
        message: 'Cuenta de organización inactiva'
      });
    }

    req.organizacion = {
      id: organizacion.id_organizacion,
      email: organizacion.correo_representante,
      nombre: organizacion.nombre,
      tipo: 'organizacion'
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }

    console.error('Error en middleware de autenticación de organización:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

const verificarTokenOrganizacionOpcional = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      req.organizacion = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    if (decoded.tipo === 'organizacion') {
      const organizacion = await OrganizacionModel.findById(decoded.id);
      
      if (organizacion && organizacion.estado === 'activa') {
        req.organizacion = {
          id: organizacion.id_organizacion,
          email: organizacion.correo_representante,
          nombre: organizacion.nombre,
          tipo: 'organizacion'
        };
      }
    }

    next();
  } catch (error) {
    req.organizacion = null;
    next();
  }
};

module.exports = {
  verificarTokenOrganizacion,
  verificarTokenOrganizacionOpcional
};
