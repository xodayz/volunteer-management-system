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
exports.UserModel = void 0;
const database_1 = __importDefault(require("../config/database"));
class UserModel {
    static findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = 'SELECT * FROM usuarios WHERE correo = $1';
                const result = yield database_1.default.query(query, [email]);
                return result.rows[0] || null;
            }
            catch (error) {
                console.error('Error buscando usuario por email:', error);
                throw error;
            }
        });
    }

    static findByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = 'SELECT * FROM usuarios WHERE username = $1';
                const result = yield database_1.default.query(query, [username]);
                return result.rows[0] || null;
            }
            catch (error) {
                console.error('Error buscando usuario por username:', error);
                throw error;
            }
        });
    }

    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = 'SELECT * FROM usuarios WHERE id_usuario = $1';
                const result = yield database_1.default.query(query, [id]);
                return result.rows[0] || null;
            }
            catch (error) {
                console.error('Error buscando usuario por ID:', error);
                throw error;
            }
        });
    }

    static create(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
        INSERT INTO usuarios (
          username, nombre, correo, password_hash, 
          telefono, fecha_nacimiento, genero, direccion, 
          interes_habilidades, rol_usuario
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `;
                const values = [
                    userData.username,
                    userData.nombre,
                    userData.correo,
                    userData.password_hash,
                    userData.telefono,
                    userData.fecha_nacimiento,
                    userData.genero,
                    userData.direccion,
                    userData.interes_habilidades,
                    userData.rol_usuario || 'voluntario'
                ];
                const result = yield database_1.default.query(query, values);
                return result.rows[0];
            }
            catch (error) {
                console.error('Error creando usuario:', error);
                throw error;
            }
        });
    }

    static updateLastAccess(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = 'UPDATE usuarios SET ultimo_acceso = CURRENT_TIMESTAMP WHERE id_usuario = $1';
                yield database_1.default.query(query, [id]);
            }
            catch (error) {
                console.error('Error actualizando último acceso:', error);
                throw error;
            }
        });
    }

    static verifyEmail(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = 'UPDATE usuarios SET email_verificado = true WHERE id_usuario = $1';
                yield database_1.default.query(query, [id]);
            }
            catch (error) {
                console.error('Error verificando email:', error);
                throw error;
            }
        });
    }
}
exports.UserModel = UserModel;
