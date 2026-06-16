// src/controllers/PlanController.js

const PlanService = require('../services/PlanService');

const PlanController = {

    /**
     * POST /api/plans
     * Profissional cria um plano para um cliente.
     */
    createPlan: async (req, res, next) => {
        try {
            const plan = await PlanService.createPlan(req.body);
            res.status(201).json(plan);
        } catch (error) {
            next(error);
        }
    },

    /**
     * GET /api/plans/my
     * Cliente vê seus próprios planos ativos.
     * Query: ?type=training|meal
     */
    getMyPlans: async (req, res, next) => {
        try {
            const clientId = req.user.id;
            const { type } = req.query;
            const plans = await PlanService.getPlansByClient(clientId, type);
            res.status(200).json(plans);
        } catch (error) {
            next(error);
        }
    },

    /**
     * GET /api/plans/created
     * Profissional vê os planos que criou.
     * Query: ?type=training|meal
     */
    getCreatedPlans: async (req, res, next) => {
        try {
            const professionalId = req.query.professionalId;
            const { type } = req.query;
            const plans = await PlanService.getPlansByProfessional(professionalId, type);
            res.status(200).json(plans);
        } catch (error) {
            next(error);
        }
    },

    /**
     * GET /api/plans/:id
     * Detalhe de um plano.
     */
    getPlanById: async (req, res, next) => {
        try {
            const plan = await PlanService.getPlanById(req.params.id);
            if (!plan) {
                return res.status(404).json({ error: 'Plano não encontrado.' });
            }
            res.status(200).json(plan);
        } catch (error) {
            next(error);
        }
    },

    /**
     * PUT /api/plans/:id
     * Profissional atualiza um plano.
     */
    updatePlan: async (req, res, next) => {
        try {
            const updated = await PlanService.updatePlan(req.params.id, req.body);
            if (!updated) {
                return res.status(404).json({ error: 'Plano não encontrado.' });
            }
            res.status(200).json(updated);
        } catch (error) {
            next(error);
        }
    },

    /**
     * DELETE /api/plans/:id
     * Remove um plano.
     */
    deletePlan: async (req, res, next) => {
        try {
            const deleted = await PlanService.deletePlan(req.params.id);
            if (!deleted) {
                return res.status(404).json({ error: 'Plano não encontrado.' });
            }
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
};

module.exports = PlanController;
