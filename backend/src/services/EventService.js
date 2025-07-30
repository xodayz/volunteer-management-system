const pool = require('../config/database').default || require('../config/database');

class EventService {
  static async createEvent(eventData) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      const categoriaCheck = await client.query(
        'SELECT id_categoria FROM categorias_eventos WHERE id_categoria = $1',
        [eventData.idCategoria]
      );

      if (categoriaCheck.rows.length === 0) {
        await client.query('ROLLBACK');
        return {
          success: false,
          message: 'La categoría seleccionada no existe'
        };
      }

      const organizacionCheck = await client.query(
        'SELECT id_organizacion FROM organizaciones WHERE id_organizacion = $1',
        [eventData.idOrganizacion]
      );

      if (organizacionCheck.rows.length === 0) {
        await client.query('ROLLBACK');
        return {
          success: false,
          message: 'Organización no encontrada'
        };
      }
      const insertQuery = `
        INSERT INTO eventos (
          nombre, descripcion, id_organizacion, fecha_inicio, fecha_fin, 
          hora_inicio, hora_fin, direccion, id_categoria, capacidad_maxima, 
          requisitos, estado_evento
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'activo')
        RETURNING *
      `;

      const valores = [
        eventData.nombre,
        eventData.descripcion,
        eventData.idOrganizacion,
        eventData.fechaInicio,
        eventData.fechaFin,
        eventData.horaInicio,
        eventData.horaFin,
        eventData.direccion,
        eventData.idCategoria,
        eventData.capacidadMaxima,
        JSON.stringify(eventData.requisitos || [])
      ];

      const result = await client.query(insertQuery, valores);
      const newEvent = result.rows[0];

      const eventWithCategory = await client.query(`
        SELECT e.*, c.nombre as categoria_nombre
        FROM eventos e
        LEFT JOIN categorias_eventos c ON e.id_categoria = c.id_categoria
        WHERE e.id_evento = $1
      `, [newEvent.id_evento]);

      await client.query('COMMIT');

      return {
        success: true,
        data: {
          ...eventWithCategory.rows[0],
          requisitos: JSON.parse(eventWithCategory.rows[0].requisitos || '[]')
        }
      };

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error al crear evento:', error);
      return {
        success: false,
        message: 'Error al crear el evento en la base de datos',
        error: error.message
      };
    } finally {
      client.release();
    }
  }

  static async getEventsByOrganization(organizacionId) {
    try {
      const query = `
        SELECT e.*, c.nombre as categoria_nombre
        FROM eventos e
        LEFT JOIN categorias_eventos c ON e.id_categoria = c.id_categoria
        WHERE e.id_organizacion = $1
        ORDER BY e.fecha_inicio DESC, e.created_at DESC
      `;

      const result = await pool.query(query, [organizacionId]);
      
      const events = result.rows.map(event => ({
        ...event,
        requisitos: JSON.parse(event.requisitos || '[]')
      }));

      return {
        success: true,
        data: events
      };

    } catch (error) {
      console.error('Error al obtener eventos:', error);
      return {
        success: false,
        message: 'Error al obtener eventos de la base de datos'
      };
    }
  }

  static async getEventById(eventId, organizacionId) {
    try {
      const query = `
        SELECT e.*, c.nombre as categoria_nombre
        FROM eventos e
        LEFT JOIN categorias_eventos c ON e.id_categoria = c.id_categoria
        WHERE e.id_evento = $1 AND e.id_organizacion = $2
      `;

      const result = await pool.query(query, [eventId, organizacionId]);

      if (result.rows.length === 0) {
        return {
          success: false,
          message: 'Evento no encontrado'
        };
      }

      const event = {
        ...result.rows[0],
        requisitos: JSON.parse(result.rows[0].requisitos || '[]')
      };

      return {
        success: true,
        data: event
      };

    } catch (error) {
      console.error('Error al obtener evento:', error);
      return {
        success: false,
        message: 'Error al obtener evento de la base de datos'
      };
    }
  }

  static async updateEvent(eventId, eventData, organizacionId) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      const eventCheck = await client.query(
        'SELECT * FROM eventos WHERE id_evento = $1 AND id_organizacion = $2',
        [eventId, organizacionId]
      );

      if (eventCheck.rows.length === 0) {
        await client.query('ROLLBACK');
        return {
          success: false,
          message: 'Evento no encontrado'
        };
      }

      if (eventData.idCategoria) {
        const categoriaCheck = await client.query(
          'SELECT id_categoria FROM categorias_eventos WHERE id_categoria = $1',
          [eventData.idCategoria]
        );

        if (categoriaCheck.rows.length === 0) {
          await client.query('ROLLBACK');
          return {
            success: false,
            message: 'La categoría seleccionada no existe'
          };
        }
      }

      const updateFields = [];
      const values = [];
      let paramCounter = 1;

      const allowedFields = {
        nombre: 'nombre',
        descripcion: 'descripcion',
        fechaInicio: 'fecha_inicio',
        fechaFin: 'fecha_fin',
        horaInicio: 'hora_inicio',
        horaFin: 'hora_fin',
        direccion: 'direccion',
        idCategoria: 'id_categoria',
        capacidadMaxima: 'capacidad_maxima',
        requisitos: 'requisitos'
      };

      for (const [key, dbField] of Object.entries(allowedFields)) {
        if (eventData.hasOwnProperty(key) && eventData[key] !== undefined) {
          updateFields.push(`${dbField} = $${paramCounter}`);
          
          if (key === 'requisitos') {
            values.push(JSON.stringify(eventData[key] || []));
          } else {
            values.push(eventData[key]);
          }
          
          paramCounter++;
        }
      }

      if (updateFields.length === 0) {
        await client.query('ROLLBACK');
        return {
          success: false,
          message: 'No hay campos para actualizar'
        };
      }

      updateFields.push(`updated_at = CURRENT_TIMESTAMP`);

      values.push(eventId, organizacionId);

      const updateQuery = `
        UPDATE eventos 
        SET ${updateFields.join(', ')}
        WHERE id_evento = $${paramCounter} AND id_organizacion = $${paramCounter + 1}
        RETURNING *
      `;

      const result = await client.query(updateQuery, values);

      const eventWithCategory = await client.query(`
        SELECT e.*, c.nombre as categoria_nombre
        FROM eventos e
        LEFT JOIN categorias_eventos c ON e.id_categoria = c.id_categoria
        WHERE e.id_evento = $1
      `, [eventId]);

      await client.query('COMMIT');

      return {
        success: true,
        data: {
          ...eventWithCategory.rows[0],
          requisitos: JSON.parse(eventWithCategory.rows[0].requisitos || '[]')
        }
      };

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error al actualizar evento:', error);
      return {
        success: false,
        message: 'Error al actualizar el evento'
      };
    } finally {
      client.release();
    }
  }

  static async deleteEvent(eventId, organizacionId) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      const eventCheck = await client.query(
        'SELECT * FROM eventos WHERE id_evento = $1 AND id_organizacion = $2',
        [eventId, organizacionId]
      );

      if (eventCheck.rows.length === 0) {
        await client.query('ROLLBACK');
        return {
          success: false,
          message: 'Evento no encontrado'
        };
      }

      await client.query(
        'DELETE FROM eventos WHERE id_evento = $1 AND id_organizacion = $2',
        [eventId, organizacionId]
      );

      await client.query('COMMIT');

      return {
        success: true,
        message: 'Evento eliminado exitosamente'
      };

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error al eliminar evento:', error);
      return {
        success: false,
        message: 'Error al eliminar el evento'
      };
    } finally {
      client.release();
    }
  }

  static async getCategorias() {
    try {
      const query = `
        SELECT id_categoria, nombre, descripcion
        FROM categorias_eventos
        ORDER BY nombre ASC
      `;

      const result = await pool.query(query);

      return {
        success: true,
        data: result.rows
      };

    } catch (error) {
      console.error('Error al obtener categorías:', error);
      return {
        success: false,
        message: 'Error al obtener categorías de la base de datos'
      };
    }
  }

  static async addVolunteerToEvent(eventId, volunteerId, organizacionId) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      const eventCheck = await client.query(
        'SELECT * FROM eventos WHERE id_evento = $1 AND id_organizacion = $2',
        [eventId, organizacionId]
      );

      if (eventCheck.rows.length === 0) {
        await client.query('ROLLBACK');
        return {
          success: false,
          message: 'Evento no encontrado'
        };
      }

      const volunteerCheck = await client.query(
        'SELECT * FROM usuarios WHERE id_usuario = $1',
        [volunteerId]
      );

      if (volunteerCheck.rows.length === 0) {
        await client.query('ROLLBACK');
        return {
          success: false,
          message: 'Voluntario no encontrado'
        };
      }

      const event = eventCheck.rows[0];
      if (event.voluntarios_inscritos >= event.capacidad_maxima) {
        await client.query('ROLLBACK');
        return {
          success: false,
          message: 'El evento ya alcanzó su capacidad máxima'
        };
      }

      await client.query(
        'UPDATE eventos SET voluntarios_inscritos = voluntarios_inscritos + 1 WHERE id_evento = $1',
        [eventId]
      );

      await client.query('COMMIT');

      return {
        success: true,
        message: 'Voluntario agregado al evento exitosamente'
      };

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error al agregar voluntario:', error);
      return {
        success: false,
        message: 'Error al agregar voluntario al evento'
      };
    } finally {
      client.release();
    }
  }

  static async removeVolunteerFromEvent(eventId, volunteerId, organizacionId) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      const eventCheck = await client.query(
        'SELECT * FROM eventos WHERE id_evento = $1 AND id_organizacion = $2',
        [eventId, organizacionId]
      );

      if (eventCheck.rows.length === 0) {
        await client.query('ROLLBACK');
        return {
          success: false,
          message: 'Evento no encontrado'
        };
      }

      await client.query(
        'UPDATE eventos SET voluntarios_inscritos = GREATEST(0, voluntarios_inscritos - 1) WHERE id_evento = $1',
        [eventId]
      );

      await client.query('COMMIT');

      return {
        success: true,
        message: 'Voluntario removido del evento exitosamente'
      };

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error al remover voluntario:', error);
      return {
        success: false,
        message: 'Error al remover voluntario del evento'
      };
    } finally {
      client.release();
    }
  }

  static async getEventVolunteers(eventId, organizacionId) {
    try {
      const eventCheck = await pool.query(
        'SELECT * FROM eventos WHERE id_evento = $1 AND id_organizacion = $2',
        [eventId, organizacionId]
      );

      if (eventCheck.rows.length === 0) {
        return {
          success: false,
          message: 'Evento no encontrado'
        };
      }

      return {
        success: true,
        data: {
          evento: eventCheck.rows[0],
          voluntarios: []
        }
      };

    } catch (error) {
      console.error('Error al obtener voluntarios del evento:', error);
      return {
        success: false,
        message: 'Error al obtener voluntarios del evento'
      };
    }
  }
}

module.exports = EventService;
