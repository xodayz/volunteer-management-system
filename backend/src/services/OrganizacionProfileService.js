const bcrypt = require('bcrypt');
const pool = require('../config/database');

class OrganizacionProfileService {
  // Obtener perfil de la organización
  static async getProfile(organizacionId) {
    try {
      const query = `
        SELECT 
          id_organizacion,
          nombre,
          descripcion,
          nombre_representante,
          correo_representante,
          telefono_representante,
          direccion,
          sitio_web,
          fecha_registro,
          email,
          estado
        FROM organizaciones 
        WHERE id_organizacion = $1
      `;
      
      const result = await pool.query(query, [organizacionId]);
      
      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error en getProfile:', error);
      throw error;
    }
  }

  // Actualizar perfil de la organización
  static async updateProfile(organizacionId, updateData) {
    try {
      const allowedFields = [
        'nombre', 
        'descripcion', 
        'nombre_representante', 
        'correo_representante', 
        'telefono_representante', 
        'direccion', 
        'sitio_web'
      ];

      // Filtrar solo campos permitidos
      const filteredData = {};
      allowedFields.forEach(field => {
        if (updateData[field] !== undefined) {
          filteredData[field] = updateData[field];
        }
      });

      if (Object.keys(filteredData).length === 0) {
        throw new Error('No hay campos válidos para actualizar');
      }

      // Verificar si el correo del representante ya existe (si se está actualizando)
      if (filteredData.correo_representante) {
        const emailCheckQuery = `
          SELECT id_organizacion 
          FROM organizaciones 
          WHERE correo_representante = $1 AND id_organizacion != $2
        `;
        const emailCheck = await pool.query(emailCheckQuery, [filteredData.correo_representante, organizacionId]);
        
        if (emailCheck.rows.length > 0) {
          throw new Error('El correo_representante ya está en uso por otra organización');
        }
      }

      // Construir query dinámico
      const setClause = Object.keys(filteredData)
        .map((key, index) => `${key} = $${index + 2}`)
        .join(', ');
      
      const values = [organizacionId, ...Object.values(filteredData)];

      const query = `
        UPDATE organizaciones 
        SET ${setClause}, fecha_actualizacion = CURRENT_TIMESTAMP
        WHERE id_organizacion = $1
        RETURNING 
          id_organizacion,
          nombre,
          descripcion,
          nombre_representante,
          correo_representante,
          telefono_representante,
          direccion,
          sitio_web,
          fecha_registro,
          email,
          estado
      `;

      const result = await pool.query(query, values);
      
      if (result.rows.length === 0) {
        throw new Error('Organización no encontrada');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error en updateProfile:', error);
      throw error;
    }
  }

  // Cambiar contraseña
  static async changePassword(organizacionId, currentPassword, newPassword) {
    try {
      // Obtener la contraseña actual de la base de datos
      const getCurrentPasswordQuery = `
        SELECT password_hash 
        FROM organizaciones 
        WHERE id_organizacion = $1
      `;
      
      const currentResult = await pool.query(getCurrentPasswordQuery, [organizacionId]);
      
      if (currentResult.rows.length === 0) {
        return {
          success: false,
          message: 'Organización no encontrada'
        };
      }

      const storedPasswordHash = currentResult.rows[0].password_hash;

      // Verificar la contraseña actual
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, storedPasswordHash);
      
      if (!isCurrentPasswordValid) {
        return {
          success: false,
          message: 'La contraseña actual es incorrecta'
        };
      }

      // Verificar que la nueva contraseña sea diferente
      const isSamePassword = await bcrypt.compare(newPassword, storedPasswordHash);
      if (isSamePassword) {
        return {
          success: false,
          message: 'La nueva contraseña debe ser diferente a la actual'
        };
      }

      // Hashear la nueva contraseña
      const saltRounds = 12;
      const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

      // Actualizar la contraseña en la base de datos
      const updateQuery = `
        UPDATE organizaciones 
        SET password_hash = $1, fecha_actualizacion = CURRENT_TIMESTAMP
        WHERE id_organizacion = $2
      `;
      
      await pool.query(updateQuery, [newPasswordHash, organizacionId]);

      return {
        success: true,
        message: 'Contraseña actualizada exitosamente'
      };
    } catch (error) {
      console.error('Error en changePassword:', error);
      throw error;
    }
  }

  // Verificar contraseña actual
  static async verifyCurrentPassword(organizacionId, password) {
    try {
      const query = `
        SELECT password_hash 
        FROM organizaciones 
        WHERE id_organizacion = $1
      `;
      
      const result = await pool.query(query, [organizacionId]);
      
      if (result.rows.length === 0) {
        return false;
      }

      const passwordHash = result.rows[0].password_hash;
      return await bcrypt.compare(password, passwordHash);
    } catch (error) {
      console.error('Error en verifyCurrentPassword:', error);
      throw error;
    }
  }
}

module.exports = {
  OrganizacionProfileService
};
