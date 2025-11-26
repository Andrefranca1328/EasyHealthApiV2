// src/controllers/RatingController.js

const RatingService = require('../services/RatingService');

const RatingController = {

    createRating: async (req, res) => {
        try {
            const userId = req.user.id; 
            const professionalId = req.body.professionalId; 
            const { rating, comment } = req.body;
            
            if (!rating || !professionalId) {
                return res.status(400).json({ error: 'A avaliação e o ID do Professional são obrigatórios.' });
            }

            const ratingData = { userId, professionalId, rating, comment };

            const newRating = await RatingService.createRating(ratingData);
            
            return res.status(201).json({ 
                message: "Avaliação criada e rankeamento atualizado.", 
                rating: newRating 
            });
        } catch (error) {
            console.error('Error creating rating:', error);
            return res.status(400).json({ error: error.message });
        }
    },

    getRatingsByProfessional: async (req, res) => {
        try {
            const { professionalId } = req.params;
            const ratings = await RatingService.getRatingsByProfessional(professionalId);
            return res.status(200).json(ratings);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
};

module.exports = RatingController;