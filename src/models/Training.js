// src/models/Training.js (NOVO: Mongoose Schema)

const mongoose = require('mongoose');

const TrainingSchema = new mongoose.Schema({
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    date: { type: Date, required: true },
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

module.exports = mongoose.model('Training', TrainingSchema);