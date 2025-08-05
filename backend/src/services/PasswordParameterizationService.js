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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordParameterizationService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("../models/User");

class PasswordParameterizationService {
    /**
     * Hashear una contraseña
     */
    static hashPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const saltRounds = 12;
            return yield bcryptjs_1.default.hash(password, saltRounds);
        });
    }

    /**
     * Verificar una contraseña contra su hash
     */
    static verifyPassword(password, hash) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcryptjs_1.default.compare(password, hash);
        });
    }

    /**
     * Obtener datos del usuario desde la base de datos
     */
    static getUserCredentials(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('🔍 PasswordParameterizationService: Obteniendo credenciales del usuario:', userId);
                
                const user = yield User_1.UserModel.findById(userId);
                
                if (!user) {
                    console.log('❌ PasswordParameterizationService: Usuario no encontrado');
                    return null;
                }

                console.log('✅ PasswordParameterizationService: Usuario encontrado:', user.username);
                
                return {
                    id_usuario: user.id_usuario,
                    username: user.username,
                    correo: user.correo,
                    password_hash: user.password_hash
                };
            }
            catch (error) {
                console.error('💥 PasswordParameterizationService: Error obteniendo credenciales:', error);
                throw error;
            }
        });
    }

    /**
     * Verificar contraseña actual del usuario
     */
    static verifyUserPassword(userId, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('🔐 PasswordParameterizationService: Verificando contraseña para usuario:', userId);

                // Obtener datos del usuario
                const userCredentials = yield this.getUserCredentials(userId);
                
                if (!userCredentials) {
                    return {
                        success: false,
                        message: 'Usuario no encontrado'
                    };
                }

                // Verificar contraseña
                const isValidPassword = yield this.verifyPassword(password, userCredentials.password_hash);
                
                if (isValidPassword) {
                    console.log('✅ PasswordParameterizationService: Contraseña verificada correctamente');
                    return {
                        success: true,
                        message: 'Contraseña correcta'
                    };
                } else {
                    console.log('❌ PasswordParameterizationService: Contraseña incorrecta');
                    return {
                        success: false,
                        message: 'Contraseña incorrecta'
                    };
                }
            }
            catch (error) {
                console.error('💥 PasswordParameterizationService: Error verificando contraseña:', error);
                return {
                    success: false,
                    message: 'Error interno del servidor'
                };
            }
        });
    }

    /**
     * Cambiar contraseña del usuario
     */
    static changeUserPassword(userId, currentPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('🔄 PasswordParameterizationService: Iniciando cambio de contraseña para usuario:', userId);

                // Primero verificar la contraseña actual
                const verificationResult = yield this.verifyUserPassword(userId, currentPassword);
                
                if (!verificationResult.success) {
                    console.log('❌ PasswordParameterizationService: Contraseña actual incorrecta');
                    return {
                        success: false,
                        message: 'La contraseña actual es incorrecta'
                    };
                }

                // Hashear la nueva contraseña
                console.log('🔐 PasswordParameterizationService: Hasheando nueva contraseña...');
                const newPasswordHash = yield this.hashPassword(newPassword);

                // Actualizar en la base de datos usando el método changePassword del UserModel
                console.log('💾 PasswordParameterizationService: Actualizando contraseña en base de datos...');
                const updateResult = yield User_1.UserModel.changePassword(userId, newPasswordHash);

                if (updateResult.success) {
                    console.log('✅ PasswordParameterizationService: Contraseña cambiada exitosamente');
                    return {
                        success: true,
                        message: 'Contraseña cambiada exitosamente'
                    };
                } else {
                    console.log('❌ PasswordParameterizationService: Error actualizando contraseña:', updateResult.message);
                    return updateResult;
                }
            }
            catch (error) {
                console.error('💥 PasswordParameterizationService: Error cambiando contraseña:', error);
                return {
                    success: false,
                    message: 'Error interno del servidor'
                };
            }
        });
    }
}

exports.PasswordParameterizationService = PasswordParameterizationService;
