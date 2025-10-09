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
    professional_type: {
        type: db.Sequelize.ENUM('nutritionist', 'personal_trainer'),
        allowNull: false
    },
    specialty: {
        type: db.Sequelize.STRING,
        allowNull: false
    }, 
    weighted_rating: {
        type: db.Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0.0 
    },
    profile_views_7: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    tableName: 'professional',
    underscored: true,
    timestamps: true 
});

// Definição das Associações para o modelo Professional
Professional.associate = (models) => {
    // Um Profissional pertence a um Usuário
    Professional.belongsTo(models.User, { foreignKey: 'user_id' });
    
    // Um Profissional tem muitos Logs de Visualização
    Professional.hasMany(models.ProfileViewLog, { foreignKey: 'professional_id', onDelete: 'CASCADE' });
    
    // FUTURO: Um Profissional pode ter muitas Avaliações (Reviews)
    // Professional.hasMany(models.Review, { foreignKey: 'professional_id' });
    
    // FUTURO: Um Profissional pode ter muitas Consultas
    // Professional.hasMany(models.Consulta, { foreignKey: 'professional_id' }); 
};

module.exports = Professional;