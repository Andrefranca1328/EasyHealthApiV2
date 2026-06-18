// src/routes/RatingRoutes.js

const express          = require('express');
const router           = express.Router();
const RatingController = require('../controllers/RatingController');
const authMiddleware   = require('../middlewares/authMiddleware');
const validate         = require('../middlewares/validateMiddleware');
const { create }       = require('../validators/ratingValidator');

router.use(authMiddleware);

router.post('/',                   validate(create), RatingController.createRating);
router.get('/:professionalId',                       RatingController.getRatingsByProfessional);

module.exports = router;