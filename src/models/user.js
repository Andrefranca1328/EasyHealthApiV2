// src/models/user.js (NOVO: Mongoose Schema)

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cpf: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    birthdate: { type: Date, required: true },
    address: { type: String, required: true },
    role: { type: String, enum: ['user', 'trainer'], required: true, default: 'user' }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);