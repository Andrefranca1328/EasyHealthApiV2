const db = require('../config/db');

const ProfileViewLog = db.sequelize.define('profile_views_log', {
    id: {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    professional_id: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'professional', 
            key: 'id'
        },
        onDelete: 'CASCADE',   
        onUpdate: 'CASCADE'
    },
    viewed_at: {
        type: db.Sequelize.DATE, 
        allowNull: false,
        defaultValue: db.Sequelize.NOW 
    }
}, {
    tableName: 'profile_views_log', 
    underscored: true,
    timestamps: false 
});


ProfileViewLog.associate = (models) => {

    ProfileViewLog.belongsTo(models.Professional, { foreignKey: 'professional_id' });
};

module.exports = ProfileViewLog;