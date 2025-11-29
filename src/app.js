// src/app.js (NOVO: Conexão Mongoose)

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
console.log('🧪 Conteúdo do JWT_SECRET:', process.env.JWT_SECRET);

const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db'); // Importa a função de conexão

// Os modelos ainda precisam ser importados para que o Mongoose os reconheça.
require('./models/user');
require('./models/Training');
require('./models/professional');
require('./models/ProfileViewLog');
require('./models/Rating');

// rotas (não mudam)
const authRoutes = require('./routes/AuthRoutes');
const userRoutes = require('./routes/UserRoutes');
const trainingRoutes = require('./routes/TrainingRoutes');
const professionalRoutes = require('./routes/ProfessionalRoutes');
const ratingRoutes = require('./routes/RatingRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// endpoints (não mudam)
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trainings', trainingRoutes);
app.use('/api/professionals', professionalRoutes);
app.use('/api/ratings', ratingRoutes);

app.get('/', (req, res) => res.json({ message: 'EasyHealth API is running!' }));

const startServer = async () => {
    // Inicia a conexão Mongoose
    await connectDB(); 

    app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
};

startServer();

module.exports = app;