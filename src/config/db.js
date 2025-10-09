const { Sequelize } = require('sequelize');
require('dotenv').config();

// Variáveis de ambiente (.env)
const DB_NAME = process.env.DB_NAME || 'easyhealth_db'; // nome do banco
const DB_USER = process.env.DB_USER || 'root';          // usuário MySQL
const DB_PASS = process.env.DB_PASSWORD || 'root';    // senha do MySQL
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 3306;

// Criação da conexão Sequelize
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  logging: console.log, // mostra as queries no console
  define: {
    underscored: true,  // usa snake_case nas colunas
    timestamps: true    // cria created_at e updated_at
  }
});

// Exporta conexão e classe principal
module.exports = { sequelize, Sequelize };
