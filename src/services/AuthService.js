// src/services/AuthService.js (NOVO: Lógica Mongoose)

const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const AuthService = {
    register: async (userData) => {

        const existingUser = await User.findOne({ 
            $or: [{ email: userData.email }, { cpf: userData.cpf }] 
        });

        if (existingUser) {
            throw new Error('Email ou CPF já cadastrado.');
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        
        // Cria o usuário usando o Mongoose
        const newUser = await User.create({
            ...userData,
            password: hashedPassword
        });

        // O Mongoose não tem toJSON() com exclusão de campos por padrão, excluímos manualmente.
        const { password, ...userWithoutPassword } = newUser._doc;
        return userWithoutPassword;
    },

    login: async (email, password) => {
        // Encontra o usuário pelo email
        const user = await User.findOne({ email }); 
        if (!user) {
            throw new Error('Email ou senha inválidos.');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Email ou senha inválidos.');
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role }, // Usamos _id no Mongoose
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );
        
        // Excluímos a senha do objeto retornado
        const { password: _, ...userWithoutPassword } = user._doc;
        return { user: userWithoutPassword, token };
    },
};

module.exports = AuthService;