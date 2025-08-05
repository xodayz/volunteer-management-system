const express = require('express');
const router = express.Router();
const { PasswordParameterizationController } = require('../controllers/PasswordParameterizationController');
const { authenticateToken } = require('../middleware/auth');

// Aplicar middleware de autenticación a todas las rutas
router.use(authenticateToken);

/**
 * @route POST /api/password/verify
 * @desc Verificar contraseña actual del usuario  
 * @access Private
 */
router.post('/verify', PasswordParameterizationController.verifyCurrentPassword);

/**
 * @route POST /api/password/change
 * @desc Cambiar contraseña del usuario
 * @access Private
 */
router.post('/change', PasswordParameterizationController.changePassword);

module.exports = router;
