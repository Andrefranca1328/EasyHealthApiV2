// src/services/RatingService.js

const mongoose = require('mongoose');
const Rating = require('../models/Rating');
const Professional = require('../models/professional');

const RatingService = {
  calculateWeightedRating: async (professionalId) => {
    const matchId = mongoose.Types.ObjectId.isValid(professionalId)
      ? mongoose.Types.ObjectId(professionalId)
      : professionalId;

    const result = await Rating.aggregate([
      { $match: { professionalId: matchId } },
      {
        $group: {
          _id: '$professionalId',
          averageRating: { $avg: '$rating' },
          totalRatings: { $sum: 1 }
        }
      }
    ]);

    const averageRating = result[0]?.averageRating || 0;
    const totalRatings = result[0]?.totalRatings || 0;

    const C = 5;
    const m = 4.0;
    const weightedRating = ((averageRating * totalRatings) + (m * C)) / (totalRatings + C);

    await Professional.findByIdAndUpdate(professionalId, {
      weighted_rating: weightedRating,
      total_ratings: totalRatings
    });

    return { weightedRating, totalRatings };
  },

  createRating: async (ratingData) => {
    const newRating = await Rating.create(ratingData);
    await RatingService.calculateWeightedRating(newRating.professionalId);
    return newRating;
  },

  getRatingsByProfessional: (professionalId) =>
    Rating.find({ professionalId }).lean()
};

module.exports = RatingService;