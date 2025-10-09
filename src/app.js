require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./config/db');

// importe modelos antes de definir associações e sincronizar o banco
const User = require('./models/user');
const Consulta = require('./models/consulta');
const Training = require('./models/Training');
const Professional = require('./models/professional');
const ProfileViewLog = require('./models/ProfileViewLog');

// chame associate em cada model que o define
const models = { User, Consulta, Training, Professional, ProfileViewLog };
Object.values(models)
  .filter(model => typeof model.associate === 'function')
  .forEach(model => model.associate(models));

// rotas
const consultaRoutes = require('./routes/consultaRoutes');
const authRoutes = require('./routes/AuthRoutes');
const userRoutes = require('./routes/UserRoutes');
const trainingRoutes = require('./routes/TrainingRoutes');
const professionalRoutes = require('./routes/ProfessionalRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// endpoints
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trainings', trainingRoutes);
app.use('/api/consultas', consultaRoutes);
app.use('/api/professionals', professionalRoutes);

app.get('/', (req, res) => res.json({ message: 'EasyHealth API is running!' }));

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco de dados estabelecida:', sequelize.config.database, sequelize.config.host);

    // sincroniza modelos com o banco (em dev use alter: true; force: true remove dados)
    await sequelize.sync({ alter: true, logging: console.log });
    console.log('🔄 Modelos sincronizados com o banco de dados.');

    app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
  } catch (err) {
    console.error('❌ Falha na inicialização do servidor ou DB:', err);
    process.exit(1);
  }
};

startServer();

module.exports = app;