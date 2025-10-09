const express = require('express');
const router = express.Router();
const professionalController = require('../controllers/professionalController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/top-rated', professionalController.getTopRatedProfessionals); 
router.get('/type/:type', professionalController.getProfessionalsByType);
router.get('/:id/profile-views', professionalController.getProfileViewsLast7Days); 
router.post('/', professionalController.createProfessional);
router.get('/:id', professionalController.getProfessionalById);
router.put('/:id', professionalController.updateProfessional);
router.delete('/:id', professionalController.deleteProfessional);


module.exports = router;