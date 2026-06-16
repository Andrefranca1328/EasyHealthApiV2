// src/routes/PlanRoutes.js

const express         = require('express');
const router          = express.Router();
const PlanController  = require('../controllers/PlanController');
const authMiddleware  = require('../middlewares/authMiddleware');
const validate        = require('../middlewares/validateMiddleware');
const { create, update } = require('../validators/planValidator');

router.use(authMiddleware);

/**
 * @swagger
 * /api/plans:
 *   post:
 *     summary: Profissional cria um plano (treino ou alimentar) para um cliente
 *     tags: [Planos]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', validate(create), PlanController.createPlan);

/**
 * @swagger
 * /api/plans/my:
 *   get:
 *     summary: Cliente vê seus planos ativos
 *     tags: [Planos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [training, meal]
 */
router.get('/my', PlanController.getMyPlans);

/**
 * @swagger
 * /api/plans/created:
 *   get:
 *     summary: Profissional vê os planos que criou
 *     tags: [Planos]
 *     security:
 *       - bearerAuth: []
 */
router.get('/created', PlanController.getCreatedPlans);

/**
 * @swagger
 * /api/plans/{id}:
 *   get:
 *     summary: Detalhe de um plano
 *     tags: [Planos]
 */
router.get('/:id', PlanController.getPlanById);

/**
 * @swagger
 * /api/plans/{id}:
 *   put:
 *     summary: Profissional atualiza um plano
 *     tags: [Planos]
 */
router.put('/:id', validate(update), PlanController.updatePlan);

/**
 * @swagger
 * /api/plans/{id}:
 *   delete:
 *     summary: Remove um plano
 *     tags: [Planos]
 */
router.delete('/:id', PlanController.deletePlan);

module.exports = router;
