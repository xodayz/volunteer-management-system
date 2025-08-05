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
exports.PasswordParameterizationController = void 0;
const express_validator_1 = require("express-validator");
const PasswordParameterizationService_1 = require("../services/PasswordParameterizationService");

// Validaciones para cambio de contraseña
const changePasswordValidation = [
    (0, express_validator_1.body)('currentPassword')
        .notEmpty()
        .withMessage('La contraseña actual es requerida'),
    (0, express_validator_1.body)('newPassword')
        .isLength({ min: 6 })
        .withMessage('La nueva contraseña debe tener al menos 6 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('La nueva contraseña debe contener al menos una mayúscula, una minúscula y un número'),
    (0, express_validator_1.body)('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error('La confirmación de contraseña no coincide');
            }
            return true;
        })
];

class PasswordParameterizationController {
    /**
     * Cambiar contraseña del usuario autenticado
     */
    static changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validar errores de entrada
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({
                        success: false,
                        message: 'Errores de validación',
                        errors: errors.array()
                    });
                }

                const userId = req.user.id;
                const { currentPassword, newPassword } = req.body;

                console.log('🔐 PasswordParameterizationController: Iniciando cambio de contraseña para usuario:', userId);

                // Llamar al servicio para cambiar la contraseña
                const result = yield PasswordParameterizationService_1.PasswordParameterizationService.changeUserPassword(userId, currentPassword, newPassword);

                if (result.success) {
                    console.log('✅ PasswordParameterizationController: Contraseña cambiada exitosamente');
                    res.status(200).json(result);
                } else {
                    console.log('❌ PasswordParameterizationController: Error cambiando contraseña:', result.message);
                    res.status(400).json(result);
                }
            }
            catch (error) {
                console.error('💥 PasswordParameterizationController: Error interno:', error);
                res.status(500).json({
                    success: false,
                    message: 'Error interno del servidor'
                });
            }
        });
    }

    /**
     * Verificar contraseña actual del usuario
     */
    static verifyCurrentPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const { password } = req.body;

                if (!password) {
                    return res.status(400).json({
                        success: false,
                        message: 'La contraseña es requerida'
                    });
                }

                console.log('🔍 PasswordParameterizationController: Verificando contraseña para usuario:', userId);

                // Llamar al servicio para verificar la contraseña
                const result = yield PasswordParameterizationService_1.PasswordParameterizationService.verifyUserPassword(userId, password);

                res.status(200).json(result);
            }
            catch (error) {
                console.error('💥 PasswordParameterizationController: Error verificando contraseña:', error);
                res.status(500).json({
                    success: false,
                    message: 'Error interno del servidor'
                });
            }
        });
    }
}

exports.PasswordParameterizationController = PasswordParameterizationController;
exports.changePasswordValidation = changePasswordValidation;
