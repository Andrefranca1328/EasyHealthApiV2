

const AuthService = require('../services/AuthService');

const AuthController = {
    register: async (req, res) => {
        try {
            const user = await AuthService.register(req.body);
            const { password, ...userWithoutPassword } = user.toJSON();
            res.status(201).json({ message: "Usuário registrado com sucesso!", user: userWithoutPassword });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
            }

            const result = await AuthService.login(email, password);
            res.status(200).json(result);
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    },
};

module.exports = AuthController;