const pool = require('../config/database');

class OrganizacionModel {
  static async findByEmail(email) {
    try {
      const query = 'SELECT * FROM organizaciones WHERE correo_representante = $1';
      const result = await pool.query(query, [email]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error buscando organización por email:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const query = 'SELECT * FROM organizaciones WHERE id_organizacion = $1';
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error buscando organización por ID:', error);
      throw error;
    }
  }

  static async create(organizacionData) {
    try {
      const {
        nombre,
        descripcion,
        nombreRepresentante,
        correoRepresentante,
        passwordHash,
        telefono,
        sitioWeb,
        direccion
      } = organizacionData;

      const query = `
        INSERT INTO organizaciones (
          nombre, 
          descripcion, 
          nombre_representante, 
          correo_representante, 
          password_hash, 
          telefono_representante, 
          sitio_web,
          direccion
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
        RETURNING *
      `;

      const values = [
        nombre,
        descripcion,
        nombreRepresentante,
        correoRepresentante,
        passwordHash,
        telefono,
        sitioWeb || null,
        direccion
      ];

      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creando organización:', error);
      throw error;
    }
  }

  static async updateLastAccess(id) {
    try {
      const query = `
        UPDATE organizaciones 
        SET ultimo_acceso = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP 
        WHERE id_organizacion = $1
      `;
      await pool.query(query, [id]);
    } catch (error) {
      console.error('Error actualizando último acceso:', error);
      throw error;
    }
  }

  static async verifyEmail(id) {
    try {
      const query = `
        UPDATE organizaciones 
        SET email_verificado = TRUE, updated_at = CURRENT_TIMESTAMP 
        WHERE id_organizacion = $1
      `;
      await pool.query(query, [id]);
    } catch (error) {
      console.error('Error verificando email:', error);
      throw error;
    }
  }

  static async findAllActive() {
    try {
      const query = `
        SELECT 
          id_organizacion,
          nombre,
          descripcion,
          nombre_representante,
          correo_representante,
          telefono_representante,
          sitio_web,
          estado,
          created_at
        FROM organizaciones 
        WHERE estado = 'activa'
        ORDER BY created_at DESC
      `;
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error obteniendo organizaciones activas:', error);
      throw error;
    }
  }

  static async updateProfile(id, updateData) {
    try {
      const {
        nombre,
        descripcion,
        nombreRepresentante,
        telefono,
        sitioWeb
      } = updateData;

      const query = `
        UPDATE organizaciones 
        SET 
          nombre = COALESCE($1, nombre),
          descripcion = COALESCE($2, descripcion),
          nombre_representante = COALESCE($3, nombre_representante),
          telefono_representante = COALESCE($4, telefono_representante),
          sitio_web = COALESCE($5, sitio_web),
          updated_at = CURRENT_TIMESTAMP
        WHERE id_organizacion = $6
        RETURNING *
      `;

      const values = [nombre, descripcion, nombreRepresentante, telefono, sitioWeb, id];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error actualizando perfil de organización:', error);
      throw error;
    }
  }
}

module.exports = { OrganizacionModel };
