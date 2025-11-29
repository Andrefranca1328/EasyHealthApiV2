// src/models/Rating.js (NOVO: Mongoose Schema)

const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: { type: String, trim: true },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    professionalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Professional',
        required: true
    }
}, {
    timestamps: true
});

// Garante que um usuário só pode avaliar um profissional uma vez (opcional)
RatingSchema.index({ userId: 1, professionalId: 1 }, { unique: true });

module.exports = mongoose.model('Rating', RatingSchema);