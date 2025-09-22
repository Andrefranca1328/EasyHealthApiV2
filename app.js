const express = require('express');
const { sequelize } = require('./config/db'); // Importa a conexão do banco
const userRoutes = require('./routes/UserRoutes'); // Importa nossas rotas

const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARE ESSENCIAL: Permite que o Express entenda o JSON enviado no corpo das requisições
app.use(express.json());

// DIRECIONAMENTO DE ROTAS:
// Dizemos ao Express que qualquer requisição que comece com '/api/users'
// deve ser gerenciada pelo nosso 'userRoutes'.
app.use('/api/users', userRoutes);

// FUNÇÃO PARA INICIAR O SERVIDOR E TESTAR O BANCO
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexão com o banco de dados estabelecida com sucesso.');
        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Não foi possível conectar ao banco de dados:', error);
    }
};

startServer();