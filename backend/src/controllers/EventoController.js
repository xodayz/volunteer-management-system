const pool = require('../config/database');

class EventoController {
  async createEvento(req, res) {
    try {
      console.log('🎯 Creando nuevo evento...');
      console.log('📝 Datos recibidos:', req.body);
      console.log('👤 Usuario autenticado:', req.user);

      const { 
        titulo, 
        descripcion, 
        fechaInicio, 
        fechaFin, 
        ubicacion, 
        tipoEvento, 
        capacidadMaxima,
        requisitos,
        categoria_id
      } = req.body;

      if (!titulo || !descripcion || !fechaInicio || !fechaFin || !ubicacion) {
        return res.status(400).json({
          success: false,
          message: 'Todos los campos obligatorios deben ser completados',
          errors: ['titulo', 'descripcion', 'fechaInicio', 'fechaFin', 'ubicacion']
        });
      }

      if (!req.user || req.user.tipo !== 'organizacion') {
        return res.status(403).json({
          success: false,
          message: 'Solo las organizaciones pueden crear eventos'
        });
      }

      const organizacionId = req.user.id;

      const organizacionQuery = 'SELECT id_organizacion, nombre FROM organizaciones WHERE id_organizacion = $1';
      const organizacionResult = await pool.query(organizacionQuery, [organizacionId]);

      if (organizacionResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Organización no encontrada'
        });
      }

      const eventoExistenteQuery = `
        SELECT id_evento FROM eventos 
        WHERE id_organizacion = $1 AND LOWER(nombre) = LOWER($2)
      `;
      const eventoExistente = await pool.query(eventoExistenteQuery, [organizacionId, titulo]);

      if (eventoExistente.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Ya existe un evento con este título en tu organización'
        });
      }

      const fechaInicioDate = new Date(fechaInicio);
      const fechaFinDate = new Date(fechaFin);
      const ahora = new Date();

      if (fechaInicioDate < ahora) {
        return res.status(400).json({
          success: false,
          message: 'La fecha de inicio no puede ser en el pasado'
        });
      }

      if (fechaFinDate <= fechaInicioDate) {
        return res.status(400).json({
          success: false,
          message: 'La fecha de fin debe ser posterior a la fecha de inicio'
        });
      }

      const insertQuery = `
        INSERT INTO eventos (
          id_organizacion, 
          nombre, 
          descripcion, 
          fecha_inicio,
          fecha_fin,
          hora_inicio,
          hora_fin,
          direccion,
          id_categoria,
          capacidad_maxima,
          requisitos,
          estado_evento,
          created_at,
          updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'planificado', NOW(), NOW())
        RETURNING *
      `;

      const horaInicio = fechaInicio.includes('T') ? fechaInicio.split('T')[1].split('.')[0] : '09:00:00';
      const horaFin = fechaFin.includes('T') ? fechaFin.split('T')[1].split('.')[0] : '18:00:00';

      const values = [
        organizacionId,
        titulo,
        descripcion,
        fechaInicio.split('T')[0],
        fechaFin.split('T')[0],
        horaInicio,
        horaFin,
        ubicacion || null,
        categoria_id || 1,
        capacidadMaxima || 50,
        requisitos ? [requisitos] : null
      ];

      const result = await pool.query(insertQuery, values);
      const nuevoEvento = result.rows[0];

      console.log('✅ Evento creado exitosamente:', nuevoEvento.id);

      res.status(201).json({
        success: true,
        message: 'Evento creado exitosamente',
        data: {
          evento: {
            id: nuevoEvento.id_evento,
            titulo: nuevoEvento.nombre,
            descripcion: nuevoEvento.descripcion,
            fechaInicio: nuevoEvento.fecha_inicio,
            fechaFin: nuevoEvento.fecha_fin,
            horaInicio: nuevoEvento.hora_inicio,
            horaFin: nuevoEvento.hora_fin,
            ubicacion: nuevoEvento.direccion,
            tipoEvento: 'voluntariado',
            capacidadMaxima: nuevoEvento.capacidad_maxima,
            requisitos: Array.isArray(nuevoEvento.requisitos) ? nuevoEvento.requisitos.join(', ') : nuevoEvento.requisitos,
            estado: nuevoEvento.estado_evento,
            organizacionId: nuevoEvento.id_organizacion,
            createdAt: nuevoEvento.created_at,
            updatedAt: nuevoEvento.updated_at
          }
        }
      });

    } catch (error) {
      console.error('❌ Error creando evento:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  async getEventosByOrganizacion(req, res) {
    try {
      console.log('📋 Obteniendo eventos de la organización...');
      console.log('👤 Usuario autenticado:', req.user);

      if (!req.user || req.user.tipo !== 'organizacion') {
        return res.status(403).json({
          success: false,
          message: 'Solo las organizaciones pueden ver sus eventos'
        });
      }

      const organizacionId = req.user.id;

      const query = `
        SELECT 
          e.*,
          o.nombre as organizacion_nombre
        FROM eventos e
        JOIN organizaciones o ON e.id_organizacion = o.id_organizacion
        WHERE e.id_organizacion = $1
        ORDER BY e.fecha_inicio ASC
      `;

      const result = await pool.query(query, [organizacionId]);

      const eventos = result.rows.map(evento => ({
        id: evento.id_evento,
        titulo: evento.nombre,
        descripcion: evento.descripcion,
        fechaInicio: evento.fecha_inicio,
        fechaFin: evento.fecha_fin,
        horaInicio: evento.hora_inicio,
        horaFin: evento.hora_fin,
        ubicacion: evento.direccion,
        tipoEvento: 'voluntariado',
        capacidadMaxima: evento.capacidad_maxima,
        requisitos: Array.isArray(evento.requisitos) ? evento.requisitos.join(', ') : evento.requisitos,
        estado: evento.estado_evento,
        organizacionNombre: evento.organizacion_nombre,
        participantesRegistrados: 0,
        createdAt: evento.created_at,
        updatedAt: evento.updated_at
      }));

      console.log(`✅ Se encontraron ${eventos.length} eventos`);

      res.json({
        success: true,
        message: 'Eventos obtenidos exitosamente',
        data: {
          eventos,
          total: eventos.length
        }
      });

    } catch (error) {
      console.error('❌ Error obteniendo eventos:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  async getEventoById(req, res) {
    try {
      const { id } = req.params;
      console.log(`🔍 Obteniendo evento con ID: ${id}`);

      const query = `
        SELECT 
          e.*,
          o.nombre as organizacion_nombre,
          o.correo as organizacion_correo
        FROM eventos e
        JOIN organizaciones o ON e.id_organizacion = o.id_organizacion
        WHERE e.id_evento = $1
      `;

      const result = await pool.query(query, [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Evento no encontrado'
        });
      }

      const evento = result.rows[0];

      res.json({
        success: true,
        message: 'Evento obtenido exitosamente',
        data: {
          evento: {
            id: evento.id_evento,
            titulo: evento.nombre,
            descripcion: evento.descripcion,
            fechaInicio: evento.fecha_inicio,
            fechaFin: evento.fecha_fin,
            horaInicio: evento.hora_inicio,
            horaFin: evento.hora_fin,
            ubicacion: evento.direccion,
            tipoEvento: 'voluntariado',
            capacidadMaxima: evento.capacidad_maxima,
            requisitos: Array.isArray(evento.requisitos) ? evento.requisitos.join(', ') : evento.requisitos,
            estado: evento.estado_evento,
            organizacionNombre: evento.organizacion_nombre,
            organizacionCorreo: evento.organizacion_correo,
            participantesRegistrados: 0,
            createdAt: evento.created_at,
            updatedAt: evento.updated_at
          }
        }
      });

    } catch (error) {
      console.error('❌ Error obteniendo evento:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new EventoController();
