const express = require('express');
const { 
  OrganizacionAuthController, 
  loginValidation, 
  registerValidation 
} = require('../controllers/OrganizacionAuthController');
const { verificarTokenOrganizacion } = require('../middleware/organizacionAuth');

const router = express.Router();

// Rutas públicas (sin autenticación)
router.post('/register', registerValidation, OrganizacionAuthController.register);
router.post('/login', loginValidation, OrganizacionAuthController.login);
router.post('/verify-token', OrganizacionAuthController.verifyToken);

// Rutas protegidas (requieren autenticación)
router.get('/profile', verificarTokenOrganizacion, OrganizacionAuthController.getProfile);
router.post('/logout', verificarTokenOrganizacion, OrganizacionAuthController.logout);

// Ruta de prueba para verificar que la autenticación funciona
router.get('/test-auth', verificarTokenOrganizacion, (req, res) => {
  res.json({
    success: true,
    message: 'Autenticación de organización exitosa',
    data: {
      organizacion: req.organizacion
    }
  });
});

module.exports = router;
