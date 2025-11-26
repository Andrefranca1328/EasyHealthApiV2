const db = require('../config/db');

const Professional = db.sequelize.define('professional', {
    id: {
        type: db.Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true    
    },
    userId: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
        field: 'user_id',
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE' 
    },

    type: { 
        type: db.Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Personal Trainer' 
    },
    weighted_rating: {
        type: db.Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0.0 
    },

    total_ratings: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    profile_views_7: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    tableName: 'professional',
    underscored: true,
    timestamps: true,
    hooks: {
        afterUpdate: (professional, options) => {
            console.log(`Professional ${professional.id} updated.`);
        }
    }
});

Professional.associate = (models) => {
    Professional.belongsTo(models.User, { foreignKey: 'user_id' });
    
    Professional.hasMany(models.ProfileViewLog, { foreignKey: 'professional_id', onDelete: 'CASCADE' });
    
    Professional.hasMany(models.Training, { foreignKey: 'professional_id' });
    
    Professional.hasMany(models.Rating, { foreignKey: 'professional_id' }); 
};

module.exports = Professional;