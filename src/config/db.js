const mongoose = require('mongoose');
require('dotenv').config();

const DB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log('✅ Conexão com MongoDB estabelecida com sucesso!');
    } catch (err) {
        console.error('❌ Falha na conexão com MongoDB:', err);
        process.exit(1);
    }
};

module.exports = { connectDB, mongoose };