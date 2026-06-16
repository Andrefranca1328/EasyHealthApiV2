// src/validators/planValidator.js
const Joi = require('joi');

const planItem = Joi.object({
    name:     Joi.string().min(1).required().messages({ 'any.required': 'Nome do item é obrigatório.' }),
    detail:   Joi.string().optional().allow(''),
    quantity: Joi.string().optional().allow(''),
    unit:     Joi.string().optional().allow('')
});

const create = Joi.object({
    title:          Joi.string().min(2).max(150).required().messages({
        'any.required': 'Título é obrigatório.'
    }),
    description:    Joi.string().max(1000).optional().allow(''),
    type:           Joi.string().valid('training', 'meal').required().messages({
        'any.only': 'Tipo deve ser "training" (treino) ou "meal" (alimentar).',
        'any.required': 'Tipo é obrigatório.'
    }),
    items:          Joi.array().items(planItem).min(1).required().messages({
        'any.required': 'Adicione pelo menos um item ao plano.',
        'array.min': 'Adicione pelo menos um item ao plano.'
    }),
    startDate:      Joi.date().iso().required().messages({ 'any.required': 'Data de início é obrigatória.' }),
    endDate:        Joi.date().iso().min(Joi.ref('startDate')).required().messages({
        'any.required': 'Data de término é obrigatória.',
        'date.min': 'Data de término deve ser após a data de início.'
    }),
    clientId:       Joi.string().hex().length(24).required().messages({ 'any.required': 'clientId é obrigatório.' }),
    professionalId: Joi.string().hex().length(24).required().messages({ 'any.required': 'professionalId é obrigatório.' })
});

const update = Joi.object({
    title:       Joi.string().min(2).max(150).optional(),
    description: Joi.string().max(1000).optional().allow(''),
    items:       Joi.array().items(planItem).min(1).optional(),
    startDate:   Joi.date().iso().optional(),
    endDate:     Joi.date().iso().optional()
}).min(1).messages({ 'object.min': 'Envie pelo menos um campo para atualizar.' });

module.exports = { create, update };
