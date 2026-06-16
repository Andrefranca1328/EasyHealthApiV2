// src/services/UserService.js

const User = require('../models/User');

const UserService = {
    getAllUsers: () => User.find().select('-password').lean(),

    getUserById: (id) => User.findById(id).select('-password').lean(),

    updateUser: async (id, data) => {
        const updated = await User.findByIdAndUpdate(id, data, { new: true, runValidators: true }).select('-password');
        return updated; // retorna o documento atualizado ou null
    },

    deleteUser: async (id) => {
        const deleted = await User.findByIdAndDelete(id);
        return deleted; // retorna o documento deletado ou null
    }
};

module.exports = UserService;