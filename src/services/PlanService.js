// src/services/PlanService.js

const Plan = require('../models/Plan');

const PlanService = {
    /**
     * Profissional cria um plano para um cliente.
     */
    createPlan(data) {
        return Plan.create(data);
    },

    /**
     * Retorna os planos de um cliente (pelo clientId).
     * @param {string} clientId
     * @param {string} [type] - filtro opcional: 'training' | 'meal'
     */
    getPlansByClient(clientId, type) {
        const query = { clientId };
        if (type) query.type = type;
        return Plan.find(query)
            .populate('professionalId', 'type city photoUrl bio')
            .sort({ startDate: -1 })
            .lean();
    },

    /**
     * Retorna os planos criados por um profissional.
     * @param {string} professionalId
     * @param {string} [type] - filtro opcional: 'training' | 'meal'
     */
    getPlansByProfessional(professionalId, type) {
        const query = { professionalId };
        if (type) query.type = type;
        return Plan.find(query)
            .populate('clientId', 'name email')
            .sort({ startDate: -1 })
            .lean();
    },

    /**
     * Busca um plano pelo ID.
     */
    getPlanById(id) {
        return Plan.findById(id)
            .populate('clientId', 'name email')
            .populate('professionalId', 'type city bio')
            .lean();
    },

    /**
     * Atualiza um plano.
     */
    async updatePlan(id, data) {
        const updated = await Plan.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        return updated;
    },

    /**
     * Remove um plano.
     */
    async deletePlan(id) {
        const deleted = await Plan.findByIdAndDelete(id);
        return deleted;
    }
};

module.exports = PlanService;
