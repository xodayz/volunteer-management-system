const express = require('express');
const router = express.Router();
const EventController = require('../controllers/EventController');
const { authenticateOrganization } = require('../middleware/organizacionAuth');

// Rutas públicas
router.get('/categorias', EventController.getCategorias);

// Rutas protegidas (requieren autenticación de organización)
router.post('/create', authenticateOrganization, EventController.createEvent);
router.get('/organization', authenticateOrganization, EventController.getEventsByOrganization);
router.get('/:id', authenticateOrganization, EventController.getEventById);
router.put('/:id', authenticateOrganization, EventController.updateEvent);
router.delete('/:id', authenticateOrganization, EventController.deleteEvent);

// Rutas para gestión de voluntarios en eventos
router.post('/:id/volunteer', authenticateOrganization, EventController.addVolunteerToEvent);
router.delete('/:id/volunteer/:volunteerId', authenticateOrganization, EventController.removeVolunteerFromEvent);
router.get('/:id/volunteers', authenticateOrganization, EventController.getEventVolunteers);

module.exports = router;
