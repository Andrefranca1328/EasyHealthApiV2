// src/models/Professional.js

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
        enum: ['Personal Trainer', 'Nutricionista'],
        required: true,
        default: 'Personal Trainer'
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    // Documento de habilitação (caminho do arquivo PDF ou URL futura)
    document: {
        type: String,
        required: true
    },
    // Número de registro profissional (CREF para Personal, CRN para Nutricionista)
    professionalRegister: {
        type: String
    },
    bio: {
        type: String,
        maxlength: 800
    },
    city: {
        type: String
    },
    state: {
        type: String,
        maxlength: 2  // sigla do estado, ex: SP, RJ
    },
    pricePerHour: {
        type: Number,
        min: 0
    },
    photoUrl: {
        type: String
    },
    weighted_rating: {
        type: Number,
        default: 0.0
    },
    total_ratings: {
        type: Number,
        default: 0
    },
    profile_views_7: {
        type: Number,
        default: 0
    },
    // Motivo de rejeição preenchido pelo admin
    rejectionReason: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Professional', ProfessionalSchema);