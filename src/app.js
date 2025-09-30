require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./config/db');

// --- Importar Modelos (Deve vir antes das associações) ---
const User = require('./models/user');
const Training = require('./models/Training');

// --- Definir Associações (Relacionamentos) ---
User.hasMany(Training, { foreignKey: 'userId' });
Training.belongsTo(User, { foreignKey: 'userId' });

// --- Importar Rotas ---
const authRoutes = require('./routes/AuthRoutes');
const userRoutes = require('./routes/UserRoutes');
const trainingRoutes = require('./routes/TrainingRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middlewares Globais ---
app.use(cors());
app.use(express.json());

// --- Mapeamento das Rotas (A CORREÇÃO PRINCIPAL) ---
// Adicionar o prefixo /api/ para todas as rotas.
app.use('/api/auth', authRoutes);     // Ex: POST /api/auth/register
app.use('/api/users', userRoutes);    // Ex: GET /api/users
app.use('/api/trainings', trainingRoutes); // Ex: POST /api/trainings


const startServer = async () => {
    try {
        // 1. Testar Conexão com o DB
        await sequelize.authenticate();
        console.log('✅ Conexão OK, DB:', sequelize.config.database);

        // 2. Sincronizar Modelos com o DB
        // Nota: O ideal é usar { alter: true } em desenvolvimento para não perder dados, 
        // mas você pode usar { force: true } uma vez para limpar tabelas corrompidas.
        await sequelize.sync({ alter: true });
        console.log('🔄 Modelos sincronizados');

        // 3. (Opcional) Sincronizar apenas Training - removido, pois o sequelize.sync({ alter: true }) já cuida disso.

        // 4. Iniciar o Servidor
        app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
    } catch (err) {
        console.error('❌ Falha na inicialização do servidor ou DB:', err);
        // Garante que o processo seja encerrado se a conexão falhar.
        process.exit(1); 
    }
};

startServer();

module.exports = app;