// src/service/UserService.js

const User = require('../models/user');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

const UserService = {

    createUser: async (userData) => {
        // Verifica se o email ou CPF já existem
        const existingUser = await User.findOne({
            where: { [Op.or]: [{ email: userData.email }, { cpf: userData.cpf }] }
        });

        if (existingUser) {
            throw new Error('Email ou CPF já cadastrado.');
        }

        // Criptografa a senha antes de salvar
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        
        // Cria o usuário no banco de dados
        const newUser = await User.create({
            ...userData,
            password: hashedPassword
        });

        return newUser;
    },

  
    getAllUsers: () => {

        return User.findAll({
            // Exclui o campo 'password' da consulta para mais segurança
            attributes: { exclude: ['password'] }
        });
    },


    getUserById: (id) => {
        // O método findByPk (Find by Primary Key) é otimizado para buscar por ID.
        return User.findByPk(id, {
            attributes: { exclude: ['password'] }
        });
    },


    updateUser: async (id, userData) => {
        // Primeiro, busca o usuário para garantir que ele existe.
        const user = await User.findByPk(id);
        if (!user) {
            // Retorna null se não encontrar, para o controller tratar como 404.
            return null;
        }

        // Se uma nova senha for fornecida, criptografa antes de atualizar.
        if (userData.password) {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            userData.password = hashedPassword;
        }

        // Atualiza a instância do usuário com os novos dados.
        await user.update(userData);
        
        // Retorna a instância do usuário já atualizada.
        return user;
    },


    deleteUser: async (id) => {
        // Busca o usuário para garantir que ele existe antes de deletar.
        const user = await User.findByPk(id);
        if (!user) {
            // Retorna null se não encontrar.
            return null;
        }

        // Deleta o usuário do banco de dados.
        await user.destroy();
        
        // Retorna o objeto do usuário que foi deletado (confirmação).
        return user;
    }
};

module.exports = UserService;