// src/models/Plan.js
// Modelo unificado para Planos de Treino (Personal Trainer) e Planos Alimentares (Nutricionista)

const mongoose = require('mongoose');

const PlanItemSchema = new mongoose.Schema({
    name:     { type: String, required: true },   // ex: "Supino Reto" / "Café da manhã"
    detail:   { type: String },                   // ex: "3x12 repetições" / "Aveia com banana"
    quantity: { type: String },                   // ex: "80kg" / "200g"
    unit:     { type: String }                    // ex: "kg" / "kcal"
}, { _id: false });

const PlanSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    // 'training' → Personal Trainer  |  'meal' → Nutricionista
    type: {
        type: String,
        enum: ['training', 'meal'],
        required: true
    },
    items: {
        type: [PlanItemSchema],
        default: []
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    clientId: {
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

module.exports = mongoose.model('Plan', PlanSchema);
