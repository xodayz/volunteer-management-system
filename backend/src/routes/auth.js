"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const auth_1 = require("../middleware/auth");

const router = (0, express_1.Router)();

// POST /api/auth/login - Iniciar sesión
router.post('/login', AuthController_1.loginValidation, AuthController_1.AuthController.login);

// POST /api/auth/register - Registrar usuario
router.post('/register', AuthController_1.registerValidation, AuthController_1.AuthController.register);

// GET /api/auth/verify - Verificar token
router.get('/verify', auth_1.authenticateToken, AuthController_1.AuthController.verifyToken);

// POST /api/auth/logout - Cerrar sesión
router.post('/logout', auth_1.authenticateToken, AuthController_1.AuthController.logout);

router.get('/test', (req, res) => {
    res.json({ message: 'Auth routes working' });
});

exports.default = router;
