const User = require('../models/User');

const UserService = {
  getAllUsers: () => User.find().select('-password').lean(),
  getUserById: (id) => User.findById(id).select('-password').lean(),
  updateUser: async (id, data) => {
    // Retorna array para manter compatibilidade com o controller (que espera padrão Sequelize)
    const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
    return updatedUser ? [1] : [0];
  },
  deleteUser: async (id) => {
    const deleted = await User.findByIdAndDelete(id);
    return deleted ? 1 : 0;
  }
};

module.exports = UserService;