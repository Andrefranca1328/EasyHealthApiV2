// src/routes/TrainingRoutes.js

const express             = require('express');
const router              = express.Router();
const TrainingController  = require('../controllers/TrainingController');
const authMiddleware      = require('../middlewares/authMiddleware');
const validate            = require('../middlewares/validateMiddleware');
const { create, update }  = require('../validators/trainingValidator');

router.use(authMiddleware);

router.post('/',    validate(create), TrainingController.createTraining);
router.get('/',                       TrainingController.getAllTrainings);
router.get('/:id',                    TrainingController.getTrainingById);
router.put('/:id',  validate(update), TrainingController.updateTraining);
router.delete('/:id',                 TrainingController.deleteTraining);

module.exports = router;