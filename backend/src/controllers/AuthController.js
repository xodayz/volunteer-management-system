"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = exports.registerValidation = exports.loginValidation = void 0;
const express_validator_1 = require("express-validator");
const AuthService_1 = require("../services/AuthService");
exports.loginValidation = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Debe ser un email válido')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres')
];
exports.registerValidation = [
    (0, express_validator_1.body)('username')
        .isLength({ min: 3, max: 30 })
        .withMessage('El nombre de usuario debe tener entre 3 y 30 caracteres')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('El nombre de usuario solo puede contener letras, números y guiones bajos'),
    (0, express_validator_1.body)('nombre')
        .isLength({ min: 2, max: 50 })
        .withMessage('El nombre debe tener entre 2 y 50 caracteres')
        .matches(/^[a-zA-ZÀ-ÿ\s]+$/)
        .withMessage('El nombre solo puede contener letras y espacios'),
    (0, express_validator_1.body)('correo')
        .isEmail()
        .withMessage('Debe ser un email válido')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
    (0, express_validator_1.body)('telefono')
        .optional()
        .matches(/^[0-9+\-\s()]+$/)
        .withMessage('Formato de teléfono inválido'),
    (0, express_validator_1.body)('fecha_nacimiento')
        .isISO8601()
        .withMessage('Debe ser una fecha válida')
        .custom((value) => {
            const birthDate = new Date(value);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            
            if (age < 18) {
                throw new Error('Debes ser mayor de 18 años para registrarte');
            }
            if (age > 100) {
                throw new Error('Edad inválida');
            }
            return true;
        }),
    (0, express_validator_1.body)('direccion')
        .isLength({ min: 10, max: 200 })
        .withMessage('La dirección debe tener entre 10 y 200 caracteres'),
    (0, express_validator_1.body)('interes_habilidades')
        .isArray({ min: 1 })
        .withMessage('Debe seleccionar al menos un interés o habilidad')
        .custom((value) => {
            const validOptions = [
                'educacion', 'salud', 'medio_ambiente', 'asistencia_social',
                'tecnologia', 'arte_cultura', 'deportes', 'construccion',
                'administracion', 'marketing', 'cocina', 'traduccion',
                'cuidado_animales', 'organizacion_eventos', 'fotografia'
            ];
            if (!value.every(item => validOptions.includes(item))) {
                throw new Error('Opciones de intereses inválidas');
            }
            return true;
        })
];
class AuthController {
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({
                        success: false,
                        message: 'Datos inválidos',
                        errors: errors.array()
                    });
                }
                const { email, password } = req.body;
                const result = yield AuthService_1.AuthService.login({ email, password });
                const statusCode = result.success ? 200 : 401;
                res.status(statusCode).json(result);
            }
            catch (error) {
                console.error('Error en login controller:', error);
                res.status(500).json({
                    success: false,
                    message: 'Error interno del servidor'
                });
            }
        });
    }
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({
                        success: false,
                        message: 'Datos inválidos',
                        errors: errors.array()
                    });
                }
                const result = yield AuthService_1.AuthService.register(req.body);
                const statusCode = result.success ? 201 : 400;
                res.status(statusCode).json(result);
            }
            catch (error) {
                console.error('Error en register controller:', error);
                res.status(500).json({
                    success: false,
                    message: 'Error interno del servidor'
                });
            }
        });
    }
    static verifyToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                res.json({
                    success: true,
                    message: 'Token válido',
                    user
                });
            }
            catch (error) {
                console.error('Error verificando token:', error);
                res.status(500).json({
                    success: false,
                    message: 'Error interno del servidor'
                });
            }
        });
    }
    static getProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('👤 AuthController.getProfile() - Iniciando...');
                console.log('👤 req.user:', req.user);
                
                const userId = req.user.id;
                console.log('👤 ID de usuario:', userId);
                
                const result = yield AuthService_1.AuthService.getProfile(userId);
                console.log('👤 Resultado del servicio:', result);

                if (result.success) {
                    res.status(200).json(result);
                } else {
                    res.status(404).json(result);
                }
            } catch (error) {
                console.error('❌ Error obteniendo perfil de usuario:', error);
                res.status(500).json({
                    success: false,
                    message: 'Error interno del servidor'
                });
            }
        });
    }
    static logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.json({
                success: true,
                message: 'Sesión cerrada exitosamente'
            });
        });
    }
    
    static updateProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('🔄 AuthController: Iniciando actualización de perfil');
                console.log('👤 AuthController: Usuario ID:', req.user.id);
                console.log('📝 AuthController: Datos del body:', req.body);
                const userId = req.user.id;
                const updateData = req.body;
                const result = yield AuthService_1.AuthService.updateProfile(userId, updateData);
                console.log('📊 AuthController: Resultado del servicio:', result);
                if (result.success) {
                    res.json({
                        success: true,
                        message: 'Perfil actualizado exitosamente',
                        data: result.data
                    });
                }
                else {
                    res.status(400).json({
                        success: false,
                        message: result.message
                    });
                }
            }
            catch (error) {
                console.error('❌ AuthController: Error en updateProfile:', error);
                res.status(500).json({
                    success: false,
                    message: 'Error interno del servidor'
                });
            }
        });
    }
}
exports.AuthController = AuthController;
