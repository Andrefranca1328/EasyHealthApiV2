const db = require('../config/db');

const User = db.sequelize.define('users', {

    id: { type: db.Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: db.Sequelize.STRING, allowNull: false },
    email: { type: db.Sequelize.STRING, allowNull: false, unique: true },
    password: { type: db.Sequelize.STRING, allowNull: false },
    cpf: { type: db.Sequelize.STRING, allowNull: false, unique: true },
    phone: { type: db.Sequelize.STRING, allowNull: false },
    birthdate: { type: db.Sequelize.DATEONLY, allowNull: false },
    address: { type: db.Sequelize.STRING, allowNull: false },
<<<<<<< HEAD:models/user.js
    status: {type: db.Sequelize.INTEGER, unique:false }

=======
    role: { type: db.Sequelize.ENUM('user', 'nutritionist', 'trainer'), allowNull: false, defaultValue: 'user' }
>>>>>>> e290ee6a13241f59a6305aa79ae7cd18620500b6:src/models/user.js
});

module.exports = User;