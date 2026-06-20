// src/routes/ProfessionalRoutes.js

const express                  = require('express');
const router                   = express.Router();
const ProfessionalController   = require('../controllers/professionalController');
const authMiddleware           = require('../middlewares/authMiddleware');
const upload                   = require('../middlewares/uploadMiddleware');
const validate                 = require('../middlewares/validateMiddleware');
const { create, update }       = require('../validators/professionalValidator');

router.use(authMiddleware);

// Listagem pública (autenticada) de profissionais aprovados — com filtros opcionais
router.get('/',                   ProfessionalController.getAllProfessionals);
router.get('/search',             ProfessionalController.searchProfessionals);
router.get('/filters',            ProfessionalController.getFilterOptions);
router.get('/top-rated',          ProfessionalController.getTopRatedProfessionals);
router.get('/type/:type',         ProfessionalController.getProfessionalsByType);
router.get('/:id/profile-views',  ProfessionalController.getProfileViewsLast7Days);
router.get('/:id',                ProfessionalController.getProfessionalById);

// Upload de PDF obrigatório no campo 'document'
router.post('/',   upload.single('document'), validate(create), ProfessionalController.createProfessional);
router.put('/:id', validate(update),          ProfessionalController.updateProfessional);
router.delete('/:id',                         ProfessionalController.deleteProfessional);

module.exports = router;