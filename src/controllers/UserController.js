// src/controllers/UserController.js

const UserService = require('../services/UserService');

const UserController = {

    getAllUsers: async (req, res, next) => {
        try {
            const users = await UserService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    },

    getUserById: async (req, res, next) => {
        try {
            const user = await UserService.getUserById(req.params.id);
            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado.' });
            }
            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    },

    updateUser: async (req, res, next) => {
        try {
            const updated = await UserService.updateUser(req.params.id, req.body);
            if (!updated) {
                return res.status(404).json({ error: 'Usuário não encontrado.' });
            }
            res.status(200).json(updated);
        } catch (error) {
            next(error);
        }
    },

    deleteUser: async (req, res, next) => {
        try {
            const deleted = await UserService.deleteUser(req.params.id);
            if (!deleted) {
                return res.status(404).json({ error: 'Usuário não encontrado.' });
            }
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
};

module.exports = UserController;