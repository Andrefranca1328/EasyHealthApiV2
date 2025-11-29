// src/models/ProfileViewLog.js (NOVO: Mongoose Schema)

const mongoose = require('mongoose');

const ProfileViewLogSchema = new mongoose.Schema({
    professionalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Professional',
        required: true
    },
    viewed_at: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: false // Manter como false, pois a data já está no campo viewed_at
});

module.exports = mongoose.model('ProfileViewLog', ProfileViewLogSchema);