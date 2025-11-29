// src/models/professional.js (NOVO: Mongoose Schema)

const mongoose = require('mongoose');

const ProfessionalSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        unique: true
    },
    type: {
        type: String,
        required: true,
        default: 'Personal Trainer'
    },
    weighted_rating: {
        type: Number,
        required: true,
        default: 0.0
    },
    total_ratings: {
        type: Number,
        required: true,
        default: 0
    },
    profile_views_7: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Professional', ProfessionalSchema);