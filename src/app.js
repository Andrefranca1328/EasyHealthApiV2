// src/app.js

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const express      = require('express');
const cors         = require('cors');
const path         = require('path');
const rateLimit    = require('express-rate-limit');
const { connectDB }  = require('./config/db');
const errorMiddleware = require('./middlewares/errorMiddleware');

// ── Modelos (garante registro no Mongoose) ──────────────────────────────────
require('./models/User');
require('./models/Training');
require('./models/Professional');
require('./models/ProfileViewLog');
require('./models/Rating');
require('./models/Plan');

// ── Rotas ───────────────────────────────────────────────────────────────────
const authRoutes         = require('./routes/AuthRoutes');
const userRoutes         = require('./routes/UserRoutes');
const trainingRoutes     = require('./routes/TrainingRoutes');
const professionalRoutes = require('./routes/ProfessionalRoutes');
const ratingRoutes       = require('./routes/RatingRoutes');
const planRoutes         = require('./routes/PlanRoutes');
const adminRoutes        = require('./routes/AdminRoutes');

// ── Swagger ─────────────────────────────────────────────────────────────────
const { swaggerUi, swaggerSpec } = require('./config/swagger');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── CORS configurável via .env ───────────────────────────────────────────────
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
    : ['http://localhost:3000', 'http://localhost:5173'];

app.use(cors({
    origin: (origin, callback) => {
        // Permite requisições sem origin (ex: Postman, curl, mobile)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS bloqueado para a origin: ${origin}`));
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Servir arquivos de upload ────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ── Rate limiting no endpoint de login ──────────────────────────────────────
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 20,                   // máximo 20 tentativas por janela
    message: { error: 'Muitas tentativas de login. Tente novamente em 15 minutos.' },
    standardHeaders: true,
    legacyHeaders: false
});

// ── Documentação Swagger ─────────────────────────────────────────────────────
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'EasyHealth API Docs'
}));

// ── Endpoints ────────────────────────────────────────────────────────────────
app.use('/api/auth',          loginLimiter, authRoutes);
app.use('/api/users',         userRoutes);
app.use('/api/trainings',     trainingRoutes);
app.use('/api/professionals', professionalRoutes);
app.use('/api/ratings',       ratingRoutes);
app.use('/api/plans',         planRoutes);
app.use('/api/admin',         adminRoutes);

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => res.json({
    message: 'EasyHealth API is running! 🚀',
    docs: '/api/docs',
    version: '2.0.0'
}));

// ── Global Error Handler (deve ser o último middleware) ───────────────────────
app.use(errorMiddleware);

// ── Start ─────────────────────────────────────────────────────────────────────
const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
};

startServer();

module.exports = app;