const { body, validationResult } = require('express-validator');
const { OrganizacionAuthService } = require('../services/OrganizacionAuthService');

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
];

const registerValidation = [
  body('nombreOrganizacion')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre de la organización debe tener entre 2 y 100 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ0-9\s\-&.]+$/)
    .withMessage('El nombre de la organización contiene caracteres no válidos'),
  body('nombreRepresentante')
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre del representante debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/)
    .withMessage('El nombre del representante solo puede contener letras y espacios'),
  body('correoRepresentante')
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
  body('telefono')
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage('Formato de teléfono inválido')
    .isLength({ min: 10, max: 15 })
    .withMessage('El teléfono debe tener entre 10 y 15 caracteres'),
  body('sitioWeb')
    .optional()
    .isURL()
    .withMessage('Debe ser una URL válida'),
  body('direccion')
    .isLength({ min: 10, max: 300 })
    .withMessage('La dirección debe tener entre 10 y 300 caracteres'),
  body('descripcion')
    .isLength({ min: 10, max: 1000 })
    .withMessage('La descripción debe tener entre 10 y 1000 caracteres')
];

class OrganizacionAuthController {
  static async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const result = await OrganizacionAuthService.register(req.body);

      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Error en registro de organización:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  static async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const result = await OrganizacionAuthService.login(req.body);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(401).json(result);
      }
    } catch (error) {
      console.error('Error en login de organización:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  static async getProfile(req, res) {
    try {
      const organizacionId = req.organizacion.id;
      const result = await OrganizacionAuthService.getProfile(organizacionId);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      console.error('Error obteniendo perfil de organización:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  static async logout(req, res) {
    try {
      res.status(200).json({
        success: true,
        message: 'Logout exitoso'
      });
    } catch (error) {
      console.error('Error en logout de organización:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  static async verifyToken(req, res) {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Token de acceso requerido'
        });
      }

      const result = await OrganizacionAuthService.verifyToken(token);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(401).json(result);
      }
    } catch (error) {
      console.error('Error verificando token de organización:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}

module.exports = {
  OrganizacionAuthController,
  loginValidation,
  registerValidation
};
