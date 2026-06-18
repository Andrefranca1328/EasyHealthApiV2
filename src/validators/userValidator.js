// src/validators/userValidator.js
const Joi = require('joi');

const update = Joi.object({
    name:         Joi.string().min(2).max(100).optional(),
    phone:        Joi.string().min(10).max(15).optional(),
    address:      Joi.string().min(5).optional(),
    birthdate:    Joi.date().iso().optional(),
    city:         Joi.string().max(100).optional(),
    state:        Joi.string().length(2).uppercase().optional(),
    profilePhoto: Joi.string().uri().optional()
}).min(1).messages({ 'object.min': 'Envie pelo menos um campo para atualizar.' });

module.exports = { update };
