// src/routes/ConsultaRoutes.js
const express = require('express');
const router = express.Router();
const ConsultaController = require('../controllers/ConsultaController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.post('/', ConsultaController.createConsulta);
router.get('/usuario/:userId', ConsultaController.getConsultasByUsuario);
router.get('/profissional/:professionalId', ConsultaController.getConsultasByProfissional);
router.patch('/:id/cancelar', ConsultaController.cancelConsulta);
router.patch('/:id/confirmar', ConsultaController.confirmConsulta);
router.put('/:id/reagendar', ConsultaController.rescheduleConsulta);

module.exports = router;
