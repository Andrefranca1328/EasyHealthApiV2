// src/validators/professionalValidator.js
const Joi = require('joi');

const create = Joi.object({
    userId:               Joi.string().hex().length(24).required().messages({
        'any.required': 'userId é obrigatório.'
    }),
    type:                 Joi.string().valid('Personal Trainer', 'Nutricionista', 'Fisioterapeuta', 'Endocrinologista', 'Dermatologista').required().messages({
        'any.only': 'Tipo de profissional inválido.',
        'any.required': 'Tipo é obrigatório.'
    }),
    professionalRegister: Joi.string().max(30).optional(),
    document:             Joi.string().max(500).optional(),
    bio:                  Joi.string().max(800).optional(),
    city:                 Joi.string().max(100).optional(),
    state:                Joi.string().length(2).uppercase().optional(),
    pricePerHour:         Joi.number().min(0).optional(),
    photoUrl:             Joi.string().uri().optional()
    // 'document' vem via upload multipart — não validado aqui
});

const update = Joi.object({
    type:                 Joi.string().valid('Personal Trainer', 'Nutricionista', 'Fisioterapeuta', 'Endocrinologista', 'Dermatologista').optional(),
    professionalRegister: Joi.string().max(30).optional(),
    bio:                  Joi.string().max(800).optional(),
    city:                 Joi.string().max(100).optional(),
    state:                Joi.string().length(2).uppercase().optional(),
    pricePerHour:         Joi.number().min(0).optional(),
    photoUrl:             Joi.string().uri().optional()
}).min(1).messages({ 'object.min': 'Envie pelo menos um campo para atualizar.' });

const updateStatus = Joi.object({
    status:          Joi.string().valid('approved', 'rejected').required().messages({
        'any.only': 'Status deve ser "approved" ou "rejected".',
        'any.required': 'Status é obrigatório.'
    }),
    rejectionReason: Joi.when('status', {
        is: 'rejected',
        then: Joi.string().min(5).required().messages({
            'any.required': 'Motivo de rejeição é obrigatório ao reprovar.',
            'string.min': 'Descreva melhor o motivo da rejeição.'
        }),
        otherwise: Joi.string().optional()
    })
});

module.exports = { create, update, updateStatus };
