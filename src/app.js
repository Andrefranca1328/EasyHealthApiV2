require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
console.log('🧪 Conteúdo do JWT_SECRET:', process.env.JWT_SECRET);

const express = require('express');
const cors = require('cors');
const { sequelize } = require('./config/db');

// importe modelos antes do sync
const User = require('./models/user');
const Consulta = require('./models/consulta');
const Training = require('./models/Training');

// defina associações após importar modelos
User.hasMany(Consulta, { foreignKey: { name: 'userId', field: 'user_id' }, onDelete: 'CASCADE' });
Consulta.belongsTo(User, { foreignKey: { name: 'userId', field: 'user_id' } });

User.hasMany(Training, { foreignKey: { name: 'userId', field: 'user_id' } });
Training.belongsTo(User, { foreignKey: { name: 'userId', field: 'user_id' } });

// importar rotas 
const consultaRoutes = require('./routes/consultaRoutes');
const authRoutes = require('./routes/AuthRoutes');
const userRoutes = require('./routes/UserRoutes');
const trainingRoutes = require('./routes/TrainingRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trainings', trainingRoutes);
app.use('/api/consultas', consultaRoutes);

app.get('/', (req, res) => res.json({ message: 'EasyHealth API is running!' }));

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso.', sequelize.config.database, sequelize.config.host);

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
