// src/routes/AdminRoutes.js

const express          = require('express');
const router           = express.Router();
const AdminController  = require('../controllers/AdminController');
const authMiddleware   = require('../middlewares/authMiddleware');
const adminMiddleware  = require('../middlewares/adminMiddleware');
const validate         = require('../middlewares/validateMiddleware');
const { updateStatus } = require('../validators/professionalValidator');
const Joi              = require('joi');

// Todas as rotas admin requerem JWT + role admin
router.use(authMiddleware, adminMiddleware);

/**
 * @swagger
 * /api/admin/professionals/pending:
 *   get:
 *     summary: Lista profissionais aguardando aprovação
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
router.get('/professionals/pending', AdminController.getPendingProfessionals);

/**
 * @swagger
 * /api/admin/professionals:
 *   get:
 *     summary: Lista todos os profissionais (painel admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
router.get('/professionals', AdminController.getAllProfessionals);

/**
 * @swagger
 * /api/admin/professionals/{id}/status:
 *   patch:
 *     summary: Aprova ou reprova um profissional
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
router.patch(
    '/professionals/:id/status',
    validate(updateStatus),
    AdminController.updateProfessionalStatus
);

/**
 * @swagger
 * /api/admin/users/{id}/role:
 *   patch:
 *     summary: Atualiza o role de um usuário
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
const updateRoleSchema = Joi.object({
    role: Joi.string().valid('user', 'trainer', 'nutritionist', 'admin').required()
});
router.patch(
    '/users/:id/role',
    validate(updateRoleSchema),
    AdminController.updateUserRole
);

module.exports = router;
