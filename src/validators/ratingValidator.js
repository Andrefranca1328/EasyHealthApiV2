// src/validators/ratingValidator.js
const Joi = require('joi');

const create = Joi.object({
    professionalId: Joi.string().hex().length(24).required().messages({
        'any.required': 'professionalId é obrigatório.',
        'string.length': 'professionalId inválido.'
    }),
    rating:  Joi.number().integer().min(1).max(5).required().messages({
        'any.required': 'Nota é obrigatória.',
        'number.min': 'Nota mínima é 1.',
        'number.max': 'Nota máxima é 5.'
    }),
    comment: Joi.string().max(500).optional().allow('')
});

module.exports = { create };
