// src/services/ProfessionalService.js

const Professional = require('../models/Professional');

const ProfessionalService = {
    createProfessional: (data) => Professional.create(data),

    /**
     * Lista profissionais APROVADOS com filtros opcionais.
     * @param {{ type?, city?, minRating? }} filters
     */
    getAllApproved({ type, city, minRating } = {}) {
        const query = { status: 'approved' };
        if (type)      query.type = type;
        if (city)      query.city = new RegExp(city, 'i'); // busca parcial
        if (minRating) query.weighted_rating = { $gte: Number(minRating) };

        return Professional
            .find(query)
            .populate('userId', '-password')
            .sort({ weighted_rating: -1 })
            .lean();
    },

    getProfessionalById: (id) =>
        Professional.findById(id).populate('userId', '-password').lean(),

    updateProfessional: async (id, data) => {
        const updated = await Professional.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        return updated; // retorna o documento atualizado ou null
    },

    deleteProfessional: async (id) => {
        const deleted = await Professional.findByIdAndDelete(id);
        return deleted; // retorna o documento deletado ou null
    },

    getProfessionalsByType: (type) =>
        Professional.find({ type, status: 'approved' }).populate('userId', '-password').lean(),

    getTopRatedProfessionals: (limit) =>
        Professional
            .find({ status: 'approved' })
            .sort({ weighted_rating: -1 })
            .limit(limit)
            .populate('userId', '-password')
            .lean(),

    getProfileViewsLast7Days: async (id) => {
        const prof = await Professional.findByIdAndUpdate(
            id,
            { $inc: { profile_views_7: 1 } },
            { new: true }
        );
        return prof ? prof.profile_views_7 : 0;
    }
};
module.exports = ProfessionalService;