const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
require('dotenv').config();

const AuthService = {
    register: async (userData) => {

        const existingUser = await User.findOne({
            where: { [Op.or]: [{ email: userData.email }, { cpf: userData.cpf }] }
        });

        if (existingUser) {
            throw new Error('Email ou CPF já cadastrado.');
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        

        const newUser = await User.create({
            ...userData,
            password: hashedPassword
        });

        return newUser;
    },

    login: async (email, password) => {
        // Busca o usuário pelo email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new Error('Email ou senha inválidos.');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Email ou senha inválidos.');
        }
        console.log('Valor da Chave Secreta:', process.env.JWT_SECRET);

        const token = jwt.sign({ id: user.id, email: user.email },
             process.env.JWT_SECRET,
             { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );
        const { password: _, ...userWithoutPassword } = user.toJSON();
        return { user: userWithoutPassword, token };
    },
};

module.exports = AuthService;