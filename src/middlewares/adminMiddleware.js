// src/middlewares/adminMiddleware.js
// Garante que apenas usuários com role 'admin' possam acessar a rota.
// Deve ser usado APÓS o authMiddleware.

const adminMiddleware = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Token não fornecido.' });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Acesso restrito a administradores.' });
    }

    next();
};

module.exports = adminMiddleware;
