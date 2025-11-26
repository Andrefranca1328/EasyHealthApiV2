// src/routes/RatingRoutes.js

const express = require('express');
const router = express.Router();
const RatingController = require('../controllers/RatingController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

// Rota para clientes criarem uma nova avaliação
router.post('/', RatingController.createRating);

// Rota para visualizar as avaliações de um professional
router.get('/:professionalId', RatingController.getRatingsByProfessional);

module.exports = router;