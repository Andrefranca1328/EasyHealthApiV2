// src/controllers/UserController.js

const UserService = require('../service/UserService');

const UserController = {
    createUser: async (req, res) => {
        try {
            const user = await UserService.createUser(req.body);
            const { password, ...userWithoutPassword } = user.toJSON();
            res.status(201).json(userWithoutPassword);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    getAllUsers: async (req, res) => {
        try {
            const users = await UserService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    getUserById: async (req, res) => {
        try {
            const user = await UserService.getUserById(req.params.id);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    updateUser: async (req, res) => {
        try {
            const user = await UserService.updateUser(req.params.id, req.body);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const { password, ...userWithoutPassword } = user.toJSON();
            res.status(200).json(userWithoutPassword);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },


    deleteUser: async (req, res) => {
        try {
            const user = await UserService.deleteUser(req.params.id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.status(204).send();
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};

module.exports = UserController;