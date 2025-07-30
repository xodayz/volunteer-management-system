const { body, validationResult } = require('express-validator');
const EventService = require('../services/EventService');

class EventController {

  static async createEvent(req, res) {
    try {
      await Promise.all([
        body('nombre')
          .notEmpty()
          .withMessage('El nombre del evento es requerido')
          .isLength({ min: 3, max: 100 })
          .withMessage('El nombre debe tener entre 3 y 100 caracteres')
          .run(req),
        
        body('descripcion')
          .notEmpty()
          .withMessage('La descripción es requerida')
          .isLength({ min: 10, max: 1000 })
          .withMessage('La descripción debe tener entre 10 y 1000 caracteres')
          .run(req),
        
        body('fechaInicio')
          .notEmpty()
          .withMessage('La fecha de inicio es requerida')
          .isISO8601()
          .withMessage('Formato de fecha inválido')
          .custom((value) => {
            const fecha = new Date(value);
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            if (fecha < hoy) {
              throw new Error('La fecha de inicio no puede ser anterior a hoy');
            }
            return true;
          })
          .run(req),
        
        body('fechaFin')
          .notEmpty()
          .withMessage('La fecha de fin es requerida')
          .isISO8601()
          .withMessage('Formato de fecha inválido')
          .custom((value, { req }) => {
            const fechaFin = new Date(value);
            const fechaInicio = new Date(req.body.fechaInicio);
            if (fechaFin < fechaInicio) {
              throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
            }
            return true;
          })
          .run(req),
        
        body('horaInicio')
          .notEmpty()
          .withMessage('La hora de inicio es requerida')
          .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
          .withMessage('Formato de hora inválido (HH:MM)')
          .run(req),
        
        body('horaFin')
          .notEmpty()
          .withMessage('La hora de fin es requerida')
          .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
          .withMessage('Formato de hora inválido (HH:MM)')
          .custom((value, { req }) => {
            if (req.body.fechaInicio === req.body.fechaFin) {
              if (value <= req.body.horaInicio) {
                throw new Error('La hora de fin debe ser posterior a la hora de inicio');
              }
            }
            return true;
          })
          .run(req),
        
        body('direccion')
          .notEmpty()
          .withMessage('La dirección es requerida')
          .isLength({ min: 10, max: 500 })
          .withMessage('La dirección debe tener entre 10 y 500 caracteres')
          .run(req),
        
        body('idCategoria')
          .notEmpty()
          .withMessage('La categoría es requerida')
          .isInt({ min: 1 })
          .withMessage('ID de categoría inválido')
          .run(req),
        
        body('capacidadMaxima')
          .notEmpty()
          .withMessage('La capacidad máxima es requerida')
          .isInt({ min: 1, max: 1000 })
          .withMessage('La capacidad debe estar entre 1 y 1000 personas')
          .run(req),
        
        body('requisitos')
          .optional()
          .isArray()
          .withMessage('Los requisitos deben ser un array')
          .custom((value) => {
            if (value && value.length > 0) {
              for (const requisito of value) {
                if (typeof requisito !== 'string' || requisito.trim().length === 0) {
                  throw new Error('Cada requisito debe ser un texto válido');
                }
                if (requisito.length > 100) {
                  throw new Error('Cada requisito no puede exceder 100 caracteres');
                }
              }
            }
            return true;
          })
          .run(req)
      ]);
      
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const organizacionId = req.organizacion.id;
      const eventData = {
        ...req.body,
        idOrganizacion: organizacionId
      };

      const result = await EventService.createEvent(eventData);

      if (result.success) {
        res.status(201).json({
          success: true,
          message: 'Evento creado exitosamente',
          data: result.data
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message || 'Error al crear el evento',
          errors: result.errors
        });
      }
    } catch (error) {
      console.error('Error en createEvent:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  static async getEventsByOrganization(req, res) {
    try {
      const organizacionId = req.organizacion.id;
      const result = await EventService.getEventsByOrganization(organizacionId);

      if (result.success) {
        res.json({
          success: true,
          data: result.data
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message || 'Error al obtener eventos'
        });
      }
    } catch (error) {
      console.error('Error en getEventsByOrganization:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  static async getEventById(req, res) {
    try {
      const eventId = parseInt(req.params.id);
      const organizacionId = req.organizacion.id;

      if (isNaN(eventId)) {
        return res.status(400).json({
          success: false,
          message: 'ID de evento inválido'
        });
      }

      const result = await EventService.getEventById(eventId, organizacionId);

      if (result.success) {
        res.json({
          success: true,
          data: result.data
        });
      } else {
        res.status(404).json({
          success: false,
          message: result.message || 'Evento no encontrado'
        });
      }
    } catch (error) {
      console.error('Error en getEventById:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  static async updateEvent(req, res) {
    try {
      const eventId = parseInt(req.params.id);
      const organizacionId = req.organizacion.id;

      if (isNaN(eventId)) {
        return res.status(400).json({
          success: false,
          message: 'ID de evento inválido'
        });
      }

      const result = await EventService.updateEvent(eventId, req.body, organizacionId);

      if (result.success) {
        res.json({
          success: true,
          message: 'Evento actualizado exitosamente',
          data: result.data
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message || 'Error al actualizar evento'
        });
      }
    } catch (error) {
      console.error('Error en updateEvent:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  static async deleteEvent(req, res) {
    try {
      const eventId = parseInt(req.params.id);
      const organizacionId = req.organizacion.id;

      if (isNaN(eventId)) {
        return res.status(400).json({
          success: false,
          message: 'ID de evento inválido'
        });
      }

      const result = await EventService.deleteEvent(eventId, organizacionId);

      if (result.success) {
        res.json({
          success: true,
          message: 'Evento eliminado exitosamente'
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message || 'Error al eliminar evento'
        });
      }
    } catch (error) {
      console.error('Error en deleteEvent:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  static async getCategorias(req, res) {
    try {
      const result = await EventService.getCategorias();

      if (result.success) {
        res.json({
          success: true,
          categorias: result.data
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message || 'Error al obtener categorías'
        });
      }
    } catch (error) {
      console.error('Error en getCategorias:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  static async addVolunteerToEvent(req, res) {
    try {
      const eventId = parseInt(req.params.id);
      const { volunteerId } = req.body;
      const organizacionId = req.organizacion.id;

      if (isNaN(eventId) || !volunteerId) {
        return res.status(400).json({
          success: false,
          message: 'Datos inválidos'
        });
      }

      const result = await EventService.addVolunteerToEvent(eventId, volunteerId, organizacionId);

      if (result.success) {
        res.json({
          success: true,
          message: 'Voluntario agregado al evento exitosamente'
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message || 'Error al agregar voluntario'
        });
      }
    } catch (error) {
      console.error('Error en addVolunteerToEvent:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  static async removeVolunteerFromEvent(req, res) {
    try {
      const eventId = parseInt(req.params.id);
      const volunteerId = parseInt(req.params.volunteerId);
      const organizacionId = req.organizacion.id;

      if (isNaN(eventId) || isNaN(volunteerId)) {
        return res.status(400).json({
          success: false,
          message: 'IDs inválidos'
        });
      }

      const result = await EventService.removeVolunteerFromEvent(eventId, volunteerId, organizacionId);

      if (result.success) {
        res.json({
          success: true,
          message: 'Voluntario removido del evento exitosamente'
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message || 'Error al remover voluntario'
        });
      }
    } catch (error) {
      console.error('Error en removeVolunteerFromEvent:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  static async getEventVolunteers(req, res) {
    try {
      const eventId = parseInt(req.params.id);
      const organizacionId = req.organizacion.id;

      if (isNaN(eventId)) {
        return res.status(400).json({
          success: false,
          message: 'ID de evento inválido'
        });
      }

      const result = await EventService.getEventVolunteers(eventId, organizacionId);

      if (result.success) {
        res.json({
          success: true,
          data: result.data
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message || 'Error al obtener voluntarios'
        });
      }
    } catch (error) {
      console.error('Error en getEventVolunteers:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}

module.exports = EventController;
