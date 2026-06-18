// src/models/Consulta.js
const mongoose = require('mongoose');

const ConsultaSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    professionalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Professional',
        required: true
    },
    especialidade: {
        type: String,
        required: true
    },
    data: {
        type: String,
        required: true
    }, // formato YYYY-MM-DD
    horario: {
        type: String,
        required: true
    }, // formato HH:MM
    status: {
        type: String,
        enum: ['Pendente', 'Confirmada', 'Cancelada'],
        default: 'Pendente'
    },
    multaAplicada: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Consulta', ConsultaSchema);
