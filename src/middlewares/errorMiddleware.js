// src/middlewares/errorMiddleware.js
// Global error handler — deve ser o último middleware registrado no app.js

// eslint-disable-next-line no-unused-vars
const errorMiddleware = (err, req, res, next) => {
    console.error(`[ERROR] ${req.method} ${req.originalUrl} →`, err.message);

    // Erro de validação do Mongoose (campo único duplicado)
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern || {})[0] || 'campo';
        return res.status(409).json({ error: `${field} já está em uso.` });
    }

    // Erro de cast do Mongoose (ObjectId inválido)
    if (err.name === 'CastError') {
        return res.status(400).json({ error: 'ID inválido.' });
    }

    // Erro de validação do Mongoose
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({ error: 'Dados inválidos.', details: messages });
    }

    // Erro JWT
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Token inválido.' });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expirado.' });
    }

    // Fallback genérico
    const status = err.status || err.statusCode || 500;
    const message = status === 500 ? 'Erro interno do servidor.' : err.message;
    return res.status(status).json({ error: message });
};

module.exports = errorMiddleware;
