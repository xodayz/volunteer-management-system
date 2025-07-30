const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OrganizacionModel } = require('../models/Organizacion');

class OrganizacionAuthService {
  static async register(organizacionData) {
    try {
      const {
        nombreOrganizacion,
        nombreRepresentante,
        correoRepresentante,
        password,
        telefono,
        sitioWeb,
        descripcion,
        direccion
      } = organizacionData;

      const existingOrganizacion = await OrganizacionModel.findByEmail(correoRepresentante);
      if (existingOrganizacion) {
        return {
          success: false,
          message: 'Ya existe una organización registrada con este correo electrónico'
        };
      }

      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const newOrganizacion = await OrganizacionModel.create({
        nombre: nombreOrganizacion,
        descripcion,
        nombreRepresentante,
        correoRepresentante,
        passwordHash,
        telefono,
        sitioWeb,
        direccion
      });

      const token = jwt.sign(
        {
          id: newOrganizacion.id_organizacion,
          email: newOrganizacion.correo_representante,
          tipo: 'organizacion'
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      return {
        success: true,
        message: 'Organización registrada exitosamente',
        data: {
          organizacion: {
            id: newOrganizacion.id_organizacion,
            nombre: newOrganizacion.nombre,
            nombreRepresentante: newOrganizacion.nombre_representante,
            correo: newOrganizacion.correo_representante,
            telefono: newOrganizacion.telefono_representante,
            sitioWeb: newOrganizacion.sitio_web
          },
          token
        }
      };
    } catch (error) {
      console.error('Error en registro de organización:', error);
      return {
        success: false,
        message: 'Error interno del servidor'
      };
    }
  }

  static async login(loginData) {
    try {
      const { email, password } = loginData;

      const organizacion = await OrganizacionModel.findByEmail(email);
      if (!organizacion) {
        return {
          success: false,
          message: 'Credenciales inválidas'
        };
      }

      if (organizacion.estado !== 'activa') {
        return {
          success: false,
          message: 'La cuenta de la organización está inactiva'
        };
      }

      const isPasswordValid = await bcrypt.compare(password, organizacion.password_hash);
      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Credenciales inválidas'
        };
      }

      await OrganizacionModel.updateLastAccess(organizacion.id_organizacion);

      const token = jwt.sign(
        {
          id: organizacion.id_organizacion,
          email: organizacion.correo_representante,
          tipo: 'organizacion'
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      return {
        success: true,
        message: 'Login exitoso',
        data: {
          organizacion: {
            id: organizacion.id_organizacion,
            nombre: organizacion.nombre,
            nombreRepresentante: organizacion.nombre_representante,
            correo: organizacion.correo_representante,
            telefono: organizacion.telefono_representante,
            sitioWeb: organizacion.sitio_web,
            emailVerificado: organizacion.email_verificado
          },
          token
        }
      };
    } catch (error) {
      console.error('Error en login de organización:', error);
      return {
        success: false,
        message: 'Error interno del servidor'
      };
    }
  }

  static async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      if (decoded.tipo !== 'organizacion') {
        return {
          success: false,
          message: 'Token inválido para organización'
        };
      }

      const organizacion = await OrganizacionModel.findById(decoded.id);
      if (!organizacion) {
        return {
          success: false,
          message: 'Organización no encontrada'
        };
      }

      return {
        success: true,
        data: {
          id: organizacion.id_organizacion,
          email: organizacion.correo_representante,
          tipo: 'organizacion'
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Token inválido'
      };
    }
  }

  static async getProfile(organizacionId) {
    try {
      const organizacion = await OrganizacionModel.findById(organizacionId);
      if (!organizacion) {
        return {
          success: false,
          message: 'Organización no encontrada'
        };
      }

      return {
        success: true,
        data: {
          id: organizacion.id_organizacion,
          nombre: organizacion.nombre,
          descripcion: organizacion.descripcion,
          nombreRepresentante: organizacion.nombre_representante,
          correo: organizacion.correo_representante,
          telefono: organizacion.telefono_representante,
          sitioWeb: organizacion.sitio_web,
          estado: organizacion.estado,
          emailVerificado: organizacion.email_verificado,
          fechaRegistro: organizacion.created_at
        }
      };
    } catch (error) {
      console.error('Error obteniendo perfil de organización:', error);
      return {
        success: false,
        message: 'Error interno del servidor'
      };
    }
  }
}

module.exports = { OrganizacionAuthService };
