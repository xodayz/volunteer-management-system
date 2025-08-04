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
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
class AuthService {

    static generateToken(user) {
        const payload = {
            id: user.id_usuario,
            email: user.correo,
            username: user.username,
            role: user.rol_usuario
        };
        return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '24h'
        });
    }

    static verifyToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        }
        catch (error) {
            throw new Error('Token inválido');
        }
    }

    static hashPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const saltRounds = 12;
            return yield bcryptjs_1.default.hash(password, saltRounds);
        });
    }

    static verifyPassword(password, hash) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcryptjs_1.default.compare(password, hash);
        });
    }

    static login(loginData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = loginData;
                const user = yield User_1.UserModel.findByEmail(email);
                if (!user) {
                    return {
                        success: false,
                        message: 'Credenciales inválidas'
                    };
                }

                if (user.estado_cuenta !== 'activa') {
                    return {
                        success: false,
                        message: 'Cuenta inactiva. Contacta al administrador.'
                    };
                }

                const isValidPassword = yield this.verifyPassword(password, user.password_hash);
                if (!isValidPassword) {
                    return {
                        success: false,
                        message: 'Credenciales inválidas'
                    };
                }

                yield User_1.UserModel.updateLastAccess(user.id_usuario);

                const token = this.generateToken(user);

                const userData = {
                    id_usuario: user.id_usuario,
                    username: user.username,
                    nombre: user.nombre,
                    correo: user.correo,
                    telefono: user.telefono,
                    fecha_nacimiento: user.fecha_nacimiento,
                    direccion: user.direccion,
                    interes_habilidades: user.interes_habilidades,
                    rol_usuario: user.rol_usuario,
                    foto_perfil: user.foto_perfil,
                    email_verificado: user.email_verificado
                };
                return {
                    success: true,
                    message: 'Inicio de sesión exitoso',
                    token,
                    user: userData
                };
            }
            catch (error) {
                console.error('Error en login:', error);
                return {
                    success: false,
                    message: 'Error interno del servidor'
                };
            }
        });
    }

    static register(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, nombre, correo, password, telefono, fecha_nacimiento, direccion, interes_habilidades } = userData;

                const existingUser = yield User_1.UserModel.findByEmail(correo);
                if (existingUser) {
                    return {
                        success: false,
                        message: 'El correo electrónico ya está registrado'
                    };
                }

                const existingUsername = yield User_1.UserModel.findByUsername(username);
                if (existingUsername) {
                    return {
                        success: false,
                        message: 'El nombre de usuario ya está en uso'
                    };
                }

                const password_hash = yield this.hashPassword(password);

                const interesesArray = Array.isArray(interes_habilidades) 
                    ? interes_habilidades 
                    : JSON.parse(interes_habilidades || '[]');

                const newUser = yield User_1.UserModel.create({
                    username,
                    nombre,
                    correo,
                    password_hash,
                    telefono,
                    fecha_nacimiento,
                    direccion,
                    interes_habilidades: interesesArray,
                    rol_usuario: 'voluntario'
                });

                const token = this.generateToken(newUser);

                const userResponse = {
                    id_usuario: newUser.id_usuario,
                    username: newUser.username,
                    nombre: newUser.nombre,
                    correo: newUser.correo,
                    telefono: newUser.telefono,
                    fecha_nacimiento: newUser.fecha_nacimiento,
                    direccion: newUser.direccion,
                    interes_habilidades: newUser.interes_habilidades,
                    rol_usuario: newUser.rol_usuario
                };
                return {
                    success: true,
                    message: 'Usuario registrado exitosamente',
                    token,
                    user: userResponse
                };
            }
            catch (error) {
                console.error('Error en registro:', error);
                return {
                    success: false,
                    message: 'Error interno del servidor'
                };
            }
        });
    }

    static getProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('👤 AuthService.getProfile() - Obteniendo perfil para ID:', userId);
                
                const user = yield User_1.UserModel.findById(userId);
                if (!user) {
                    return {
                        success: false,
                        message: 'Usuario no encontrado'
                    };
                }

                console.log('✅ Usuario encontrado:', user.nombre);

                // Devolver datos del perfil sin información sensible
                const userProfile = {
                    id: user.id_usuario,
                    username: user.username,
                    nombre: user.nombre,
                    correo: user.correo,
                    telefono: user.telefono,
                    fecha_nacimiento: user.fecha_nacimiento,
                    direccion: user.direccion,
                    interes_habilidades: user.interes_habilidades,
                    rol_usuario: user.rol_usuario,
                    fecha_registro: user.created_at
                };

                return {
                    success: true,
                    data: userProfile
                };
            }
            catch (error) {
                console.error('❌ Error obteniendo perfil de usuario:', error);
                return {
                    success: false,
                    message: 'Error interno del servidor'
                };
            }
        });
    }
}
exports.AuthService = AuthService;
