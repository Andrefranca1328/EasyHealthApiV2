// src/validators/authValidator.js
const Joi = require('joi');

const register = Joi.object({
    name:      Joi.string().min(2).max(100).required().messages({
        'string.min': 'Nome deve ter pelo menos 2 caracteres.',
        'any.required': 'Nome é obrigatório.'
    }),
    email:     Joi.string().email().required().messages({
        'string.email': 'E-mail inválido.',
        'any.required': 'E-mail é obrigatório.'
    }),
    password:  Joi.string().min(6).required().messages({
        'string.min': 'Senha deve ter pelo menos 6 caracteres.',
        'any.required': 'Senha é obrigatória.'
    }),
    cpf:       Joi.string().min(11).max(14).required().messages({
        'any.required': 'CPF é obrigatório.'
    }),
    phone:     Joi.string().min(10).max(15).required().messages({
        'any.required': 'Telefone é obrigatório.'
    }),
    birthdate: Joi.date().iso().required().messages({
        'any.required': 'Data de nascimento é obrigatória.'
    }),
    address:   Joi.string().min(5).required().messages({
        'any.required': 'Endereço é obrigatório.'
    }),
    role:      Joi.string().valid('user', 'trainer', 'nutritionist').default('user'),
    city:      Joi.string().max(100).optional(),
    state:     Joi.string().length(2).uppercase().optional(),
    profilePhoto: Joi.string().uri().optional()
});

const login = Joi.object({
    email:    Joi.string().email().required().messages({
        'string.email': 'E-mail inválido.',
        'any.required': 'E-mail é obrigatório.'
    }),
    password: Joi.string().required().messages({
        'any.required': 'Senha é obrigatória.'
    })
});

module.exports = { register, login };
