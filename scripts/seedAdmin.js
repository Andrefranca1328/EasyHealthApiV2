// scripts/seedAdmin.js
// Cria o primeiro usuário administrador do sistema.
// Uso: npm run seed:admin
// Requer no .env: ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');
const { connectDB } = require('../src/config/db');

// Garante que o modelo está registrado
require('../src/models/User');
const User = require('../src/models/User');

const seedAdmin = async () => {
    const email    = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const name     = process.env.ADMIN_NAME || 'Admin EasyHealth';

    if (!email || !password) {
        console.error('❌ Defina ADMIN_EMAIL e ADMIN_PASSWORD no .env');
        process.exit(1);
    }

    try {
        await connectDB();
        console.log('📦 Conectado ao banco de dados...');

        const existing = await User.findOne({ email });

        if (existing) {
            // Atualiza role para admin se já existe
            existing.role = 'admin';
            await existing.save();
            console.log(`✅ Usuário existente ${email} promovido para admin.`);
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            await User.create({
                name,
                email,
                password:  hashedPassword,
                cpf:       '00000000000', // placeholder — altere se necessário
                phone:     '00000000000',
                birthdate: new Date('1990-01-01'),
                address:   'EasyHealth HQ',
                role:      'admin'
            });
            console.log(`✅ Admin criado com sucesso: ${email}`);
        }

        await mongoose.disconnect();
        console.log('🔌 Conexão encerrada.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Erro ao criar admin:', error.message);
        process.exit(1);
    }
};

seedAdmin();
