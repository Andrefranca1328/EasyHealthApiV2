// src/middlewares/validateMiddleware.js
// Middleware genérico de validação Joi — recebe um schema e valida req.body

const validate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
        abortEarly: false,   // retorna todos os erros de uma vez
        stripUnknown: true   // remove campos não declarados no schema
    });

    if (error) {
        const messages = error.details.map((d) => d.message);
        return res.status(400).json({
            error: 'Dados inválidos.',
            details: messages
        });
    }

    req.body = value; // garante que só campos válidos cheguem ao controller
    next();
};

module.exports = validate;
