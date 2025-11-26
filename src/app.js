require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./config/db');

const User = require('./models/user');
const Training = require('./models/Training');
const Professional = require('./models/professional');
const ProfileViewLog = require('./models/ProfileViewLog');
const Rating = require('./models/Rating');

const models = { User, Training, Professional, ProfileViewLog, Rating };
Object.values(models)
  .filter(model => typeof model.associate === 'function')
  .forEach(model => model.associate(models));

const authRoutes = require('./routes/AuthRoutes');
const userRoutes = require('./routes/UserRoutes');
const trainingRoutes = require('./routes/TrainingRoutes');
const professionalRoutes = require('./routes/ProfessionalRoutes');
const ratingRoutes = require('./routes/RatingRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trainings', trainingRoutes);
app.use('/api/professionals', professionalRoutes);
app.use('/api/ratings', ratingRoutes);

app.get('/', (req, res) => res.json({ message: 'EasyHealth API is running!' }));

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco de dados estabelecida:', sequelize.config.database, sequelize.config.host);

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