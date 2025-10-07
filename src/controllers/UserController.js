const UserService = require('../services/UserService');

const UserController = {

    getAllUsers: async (req, res) => {
        try {

            console.log('Usuário autenticado:', req.user); 
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
 
            const [updated] = await UserService.updateUser(req.params.id, req.body);

            if (!updated) {
                return res.status(404).json({ error: 'User not found' });
            }
      
            const updatedUser = await UserService.getUserById(req.params.id);
            res.status(200).json(updatedUser);

        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    deleteUser: async (req, res) => {
        try {
            const deleted = await UserService.deleteUser(req.params.id);
            if (!deleted) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.status(204).send();
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};

module.exports = UserController;