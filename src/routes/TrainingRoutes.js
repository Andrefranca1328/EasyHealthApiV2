const express = require('express');
const router = express.Router();
const TrainingController = require('../controllers/TrainingController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.post('/', TrainingController.createTraining);
router.get('/', TrainingController.getAllTrainings);
router.get('/:id', TrainingController.getTrainingById);
router.put('/:id', TrainingController.updateTraining);
router.delete('/:id', TrainingController.deleteTraining);

module.exports = router;