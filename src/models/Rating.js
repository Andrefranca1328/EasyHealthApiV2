// src/models/Rating.js

const db = require('../config/db');

const Rating = db.sequelize.define('ratings', {
    id: {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    rating: {
        type: db.Sequelize.FLOAT, 
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    comment: {
        type: db.Sequelize.STRING,
        allowNull: true
    },
    userId: { 
        type: db.Sequelize.INTEGER, 
        allowNull: false,
        field: 'user_id', 
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE'
    }, 
    professionalId: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
        field: 'professional_id',
        references: {
            model: 'professional',
            key: 'id'
        },
        onDelete: 'CASCADE'
    }

}, {
    tableName: 'ratings',
    underscored: true,
    timestamps: true
});

Rating.associate = (models) => {
    Rating.belongsTo(models.User, { foreignKey: 'user_id' });
    Rating.belongsTo(models.Professional, { foreignKey: 'professional_id' });
};
    
module.exports = Rating;