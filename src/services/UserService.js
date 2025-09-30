// src/service/UserService.js

const User = require('../models/user');
const bcrypt = require('bcrypt');


const UserService = {

    getAllUsers: () => {

        return User.findAll({

            attributes: { exclude: ['password'] }
        });
    },


    getUserById: (id) => {

        return User.findByPk(id, {
            attributes: { exclude: ['password'] }
        });
    },


    updateUser: async (id, userData) => {

        const user = await User.findByPk(id);
        if (!user) {

            return null;
        }

        if (userData.password) {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            userData.password = hashedPassword;
        }

        await user.update(userData);

        return user;
    },


    deleteUser: async (id) => {

        const user = await User.findByPk(id);
        if (!user) {

            return null;
        }

        await user.destroy();
        
      
        return user;
    }
};

module.exports = UserService;