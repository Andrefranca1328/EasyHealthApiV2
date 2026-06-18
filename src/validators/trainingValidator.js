// src/validators/trainingValidator.js
const Joi = require('joi');

const create = Joi.object({
    description:    Joi.string().min(3).required().messages({
        'any.required': 'Descrição é obrigatória.'
    }),
    duration:       Joi.number().integer().min(1).required().messages({
        'any.required': 'Duração é obrigatória.',
        'number.min': 'Duração deve ser maior que 0.'
    }),
    date:           Joi.date().iso().required().messages({
        'any.required': 'Data é obrigatória.'
    }),
    userId:         Joi.string().hex().length(24).required().messages({
        'any.required': 'userId é obrigatório.'
    }),
    professionalId: Joi.string().hex().length(24).required().messages({
        'any.required': 'professionalId é obrigatório.'
    })
});

const update = Joi.object({
    description: Joi.string().min(3).optional(),
    duration:    Joi.number().integer().min(1).optional(),
    date:        Joi.date().iso().optional()
}).min(1).messages({ 'object.min': 'Envie pelo menos um campo para atualizar.' });

module.exports = { create, update };
