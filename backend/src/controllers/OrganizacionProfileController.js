const { body, validationResult } = require('express-validator');
const { OrganizacionProfileService } = require('../services/OrganizacionProfileService');

// Validaciones para actualizar perfil
const updateProfileValidation = [
  body('nombre')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres')
    .trim(),
  body('descripcion')
    .optional()
    .isLength({ max: 500 })
    .withMessage('La descripción no puede exceder 500 caracteres')
    .trim(),
  body('nombre_representante')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre del representante debe tener entre 2 y 100 caracteres')
    .trim(),
  body('correo_representante')
    .optional()
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail(),
  body('telefono_representante')
    .optional()
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage('El teléfono solo puede contener números, espacios, paréntesis, + y -')
    .isLength({ min: 10, max: 20 })
    .withMessage('El teléfono debe tener entre 10 y 20 caracteres'),
  body('direccion')
    .optional()
    .isLength({ max: 200 })
    .withMessage('La dirección no puede exceder 200 caracteres')
    .trim(),
  body('sitio_web')
    .optional()
    .isURL()
    .withMessage('Debe ser una URL válida')
];

// Validaciones para cambio de contraseña
const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('La contraseña actual es requerida'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('La nueva contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('La nueva contraseña debe contener al menos: 1 minúscula, 1 mayúscula, 1 número y 1 carácter especial'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Las contraseñas no coinciden');
      }
      return true;
    })
];

class OrganizacionProfileController {
  // Obtener perfil de la organización
  static async getProfile(req, res) {
    try {
      const organizacionId = req.organizacion.id_organizacion;
      
      const profile = await OrganizacionProfileService.getProfile(organizacionId);
      
      if (!profile) {
        return res.status(404).json({
          success: false,
          message: 'Perfil de organización no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Perfil obtenido exitosamente',
        data: profile
      });
    } catch (error) {
      console.error('Error en getProfile:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Actualizar perfil de la organización
  static async updateProfile(req, res) {
    try {
      // Validar entrada
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const organizacionId = req.organizacion.id_organizacion;
      const updateData = req.body;

      // Eliminar campos vacíos
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === '' || updateData[key] === null || updateData[key] === undefined) {
          delete updateData[key];
        }
      });

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No se proporcionaron datos para actualizar'
        });
      }

      const updatedProfile = await OrganizacionProfileService.updateProfile(organizacionId, updateData);

      res.json({
        success: true,
        message: 'Perfil actualizado exitosamente',
        data: updatedProfile
      });
    } catch (error) {
      console.error('Error en updateProfile:', error);
      
      if (error.message.includes('correo_representante')) {
        return res.status(409).json({
          success: false,
          message: 'El correo del representante ya está en uso por otra organización'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Cambiar contraseña
  static async changePassword(req, res) {
    try {
      // Validar entrada
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const organizacionId = req.organizacion.id_organizacion;
      const { currentPassword, newPassword } = req.body;

      const result = await OrganizacionProfileService.changePassword(
        organizacionId, 
        currentPassword, 
        newPassword
      );

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.message
        });
      }

      res.json({
        success: true,
        message: 'Contraseña cambiada exitosamente'
      });
    } catch (error) {
      console.error('Error en changePassword:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Verificar contraseña actual (para habilitar botón)
  static async verifyCurrentPassword(req, res) {
    try {
      const { password } = req.body;
      
      if (!password) {
        return res.status(400).json({
          success: false,
          message: 'La contraseña es requerida'
        });
      }

      const organizacionId = req.organizacion.id_organizacion;
      const isValid = await OrganizacionProfileService.verifyCurrentPassword(organizacionId, password);

      res.json({
        success: true,
        isValid
      });
    } catch (error) {
      console.error('Error en verifyCurrentPassword:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = {
  OrganizacionProfileController,
  updateProfileValidation,
  changePasswordValidation
};
