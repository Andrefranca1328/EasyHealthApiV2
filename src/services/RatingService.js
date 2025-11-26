// src/services/RatingService.js

const Rating = require('../models/Rating');
const Professional = require('../models/professional');
const { sequelize } = require('../config/db');
const { Op } = require('sequelize');

const RatingService = {

    calculateWeightedRating: async (professionalId) => {
        const result = await Rating.findOne({
            attributes: [
                [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'totalRatings']
            ],
            where: { professional_id: professionalId },
            raw: true
        });

        const averageRating = parseFloat(result.averageRating) || 0;
        const totalRatings = parseInt(result.totalRatings) || 0;
        
        // Exemplo de Média Ponderada (Bayesian Average)
        // C = Mínimo de votos para ser incluído no top (ex: 5)
        // m = Média de rating em todo o sistema (se for 4.0, use 4.0, ou use um valor padrão como 3.5)
        const C = 5; // Constante: Mínimo de 5 avaliações para ser "confiável"
        const m = 4.0; // Média de avaliação do sistema (pode ser hardcoded ou calculado)

        const weightedRating = (
            (averageRating * totalRatings) + (m * C)
        ) / (totalRatings + C);

        await Professional.update(
            {
                weighted_rating: weightedRating,
                total_ratings: totalRatings
            },
            { where: { id: professionalId } }
        );

        return { weightedRating, totalRatings };
    },

    createRating: async (ratingData) => {

        const newRating = await Rating.create(ratingData);

        await RatingService.calculateWeightedRating(newRating.professionalId);

        return newRating;
    },

    getRatingsByProfessional: (professionalId) => {
        return Rating.findAll({ where: { professional_id: professionalId } });
    }
};

module.exports = RatingService;