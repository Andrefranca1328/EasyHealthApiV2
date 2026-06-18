// src/routes/ConsultaRoutes.js
const express = require('express');
const router = express.Router();
const ConsultaController = require('../controllers/ConsultaController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.post('/', ConsultaController.createConsulta);
router.get('/usuario/:userId', ConsultaController.getConsultasByUsuario);
router.patch('/:id/cancelar', ConsultaController.cancelConsulta);
router.put('/:id/reagendar', ConsultaController.rescheduleConsulta);

module.exports = router;
