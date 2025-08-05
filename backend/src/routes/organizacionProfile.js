const express = require('express');
const { 
  OrganizacionProfileController, 
  updateProfileValidation,
  changePasswordValidation 
} = require('../controllers/OrganizacionProfileController');
const { verificarTokenOrganizacion } = require('../middleware/organizacionAuth');

const router = express.Router();

// Todas las rutas requieren autenticación de organización
router.use(verificarTokenOrganizacion);

// Rutas para perfil de organización
router.get('/profile', OrganizacionProfileController.getProfile);
router.put('/profile', updateProfileValidation, OrganizacionProfileController.updateProfile);

// Rutas para gestión de contraseña
router.post('/change-password', changePasswordValidation, OrganizacionProfileController.changePassword);
router.post('/verify-password', OrganizacionProfileController.verifyCurrentPassword);

// Ruta de prueba para verificar autenticación
router.get('/test-profile', (req, res) => {
  res.json({
    success: true,
    message: 'Rutas de perfil de organización funcionando correctamente',
    organizacion: req.organizacion
  });
});

module.exports = router;
