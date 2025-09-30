require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./config/db');

// importar modelos
const User = require('./models/user');
const Training = require('./models/Training');

// definir associações aqui (após importar modelos)
User.hasMany(Training, { foreignKey: 'userId' });
Training.belongsTo(User, { foreignKey: 'userId' });

// rotas...
const authRoutes = require('./routes/AuthRoutes');
const userRoutes = require('./routes/UserRoutes');
const trainingRoutes = require('./routes/TrainingRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão OK, DB:', sequelize.config.database);

    // sincroniza todos os modelos (alter: true evita drop)
    await sequelize.sync({ alter: true });
    console.log('🔄 Modelos sincronizados');

    // FORÇAR apenas a tabela trainings (force: true dropa e recria) — usar com cuidado
    await Training.sync({ force: false, logging: console.log });
    console.log('🔨 Training.sync concluído');

    app.listen(PORT, () => console.log(`🚀 Porta ${PORT}`));
  } catch (err) {
    console.error('❌ Falha:', err);
    process.exit(1);
  }
};

startServer();

module.exports = app;