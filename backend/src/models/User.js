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
          telefono, fecha_nacimiento, direccion, 
          interes_habilidades, rol_usuario
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `;
                const values = [
                    userData.username,
                    userData.nombre,
                    userData.correo,
                    userData.password_hash,
                    userData.telefono,
                    userData.fecha_nacimiento,
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
    
    static updateProfile(userId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('🔄 UserModel: Actualizando perfil del usuario:', userId);
                console.log('📝 UserModel: Datos a actualizar:', updateData);
                // Construir la query dinámicamente basada en los campos proporcionados
                const allowedFields = ['username', 'nombre', 'correo', 'telefono', 'direccion', 'interes_habilidades'];
                const updateFields = [];
                const values = [];
                let paramIndex = 1;
                for (const [key, value] of Object.entries(updateData)) {
                    // Mapear habilidades_intereses a interes_habilidades
                    let dbField = key;
                    if (key === 'habilidades_intereses') {
                        dbField = 'interes_habilidades';
                    }
                    
                    if (allowedFields.includes(dbField) && value !== undefined) {
                        // Manejar especialmente el campo interes_habilidades para asegurar formato JSON correcto
                        let processedValue = value;
                        if (dbField === 'interes_habilidades') {
                            if (value === '' || value === null || value === undefined) {
                                processedValue = null; // Usar null en lugar de cadena vacía
                            } else if (typeof value === 'string' && value.length > 0) {
                                try {
                                    // Intentar parsear como JSON, si falla, usar como array con un elemento
                                    processedValue = JSON.parse(value);
                                } catch (e) {
                                    console.log('⚠️  Valor no es JSON válido, tratando como array:', value);
                                    processedValue = [value];
                                }
                            }
                        }
                        
                        updateFields.push(`${dbField} = $${paramIndex}`);
                        values.push(processedValue);
                        paramIndex++;
                    }
                }
                if (updateFields.length === 0) {
                    return {
                        success: false,
                        message: 'No hay campos válidos para actualizar'
                    };
                }
                // Agregar el ID del usuario al final
                values.push(userId);
                const query = `
          UPDATE usuarios 
          SET ${updateFields.join(', ')}
          WHERE id_usuario = $${paramIndex}
          RETURNING id_usuario, username, nombre, correo, telefono, direccion, interes_habilidades, created_at
        `;
                console.log('🔍 UserModel: Query SQL:', query);
                console.log('🔍 UserModel: Valores:', values);
                const result = yield database_1.default.query(query, values);
                if (result.rows.length > 0) {
                    console.log('✅ UserModel: Perfil actualizado exitosamente');
                    return {
                        success: true,
                        data: result.rows[0]
                    };
                }
                else {
                    return {
                        success: false,
                        message: 'Usuario no encontrado'
                    };
                }
            }
            catch (error) {
                console.error('❌ UserModel: Error actualizando perfil:', error);
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
    static changePassword(userId, newPasswordHash) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('🔄 UserModel: Cambiando contraseña para usuario:', userId);
                
                const query = `
                    UPDATE usuarios 
                    SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
                    WHERE id_usuario = $2
                    RETURNING id_usuario, username, correo
                `;

                const result = yield database_1.default.query(query, [newPasswordHash, userId]);
                
                if (result.rows.length > 0) {
                    console.log('✅ UserModel: Contraseña actualizada exitosamente');
                    return {
                        success: true,
                        message: 'Contraseña actualizada exitosamente',
                        data: result.rows[0]
                    };
                } else {
                    console.log('❌ UserModel: Usuario no encontrado');
                    return {
                        success: false,
                        message: 'Usuario no encontrado'
                    };
                }
            }
            catch (error) {
                console.error('❌ UserModel: Error cambiando contraseña:', error);
                return {
                    success: false,
                    message: 'Error interno del servidor'
                };
            }
        });
    }
}
exports.UserModel = UserModel;
