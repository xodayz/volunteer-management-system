"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const auth_1 = require("../middleware/auth");

const router = (0, express_1.Router)();

router.post('/login', AuthController_1.loginValidation, AuthController_1.AuthController.login);

router.post('/register', AuthController_1.registerValidation, AuthController_1.AuthController.register);

router.get('/verify', auth_1.authenticateToken, AuthController_1.AuthController.verifyToken);

router.get('/profile', auth_1.authenticateToken, AuthController_1.AuthController.getProfile);

router.post('/logout', auth_1.authenticateToken, AuthController_1.AuthController.logout);

router.get('/test', (req, res) => {
    res.json({ message: 'Auth routes working' });
});

exports.default = router;
