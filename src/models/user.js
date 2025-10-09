const db = require('../config/db');

const User = db.sequelize.define('users', {
    id: { 
        type: db.Sequelize.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    name: { 
        type: db.Sequelize.STRING, 
        allowNull: false 
    },
    email: { 
        type: db.Sequelize.STRING, 
        allowNull: false, unique: true 
    },
    password: { 
        type: db.Sequelize.STRING, 
        allowNull: false 
    },
    cpf: { 
        type: db.Sequelize.STRING, 
        allowNull: false, 
        unique: true 
    },
    phone: { 
        type: db.Sequelize.STRING, 
        allowNull: false 
    },
    birthdate: { 
        type: db.Sequelize.DATEONLY, 
        allowNull: false 
    },
    address: { 
        type: db.Sequelize.STRING, 
        allowNull: false 
    },
    role: { 
        type: db.Sequelize.ENUM('user', 'nutritionist', 'trainer'), 
        allowNull: false, 
        defaultValue: 'user' 
    }
}, {
    tableName: 'users',
    underscored: true,
    timestamps: true
});

User.associate = (models) => {

    User.hasMany(models.Consulta, { foreignKey: 'user_id', onDelete: 'CASCADE' });

    User.hasMany(models.Training, { foreignKey: 'user_id', onDelete: 'CASCADE' });

    User.hasOne(models.Professional, { foreignKey: 'user_id', onDelete: 'CASCADE' });
};

module.exports = User;