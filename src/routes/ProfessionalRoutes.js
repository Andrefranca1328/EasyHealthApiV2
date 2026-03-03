const express = require('express');
const router = express.Router();
const ProfessionalController = require('../controllers/ProfessionalController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/top-rated', ProfessionalController.getTopRatedProfessionals);
router.get('/type/:type', ProfessionalController.getProfessionalsByType);
router.get('/:id/profile-views', ProfessionalController.getProfileViewsLast7Days);
router.post('/', ProfessionalController.createProfessional);
router.get('/:id', ProfessionalController.getProfessionalById);
router.put('/:id', ProfessionalController.updateProfessional);
router.delete('/:id', ProfessionalController.deleteProfessional);


module.exports = router;