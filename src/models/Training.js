const db = require('../config/db');

const Training = db.sequelize.define('trainings', {
    id: {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    description: { 
        type: db.Sequelize.STRING, 
        allowNull: false 
    },
    duration: { 
        type: db.Sequelize.INTEGER, 
        allowNull: false 
    }, 
    date: { 
        type: db.Sequelize.DATEONLY, 
        allowNull: false 
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
    }

}, {
    tableName: 'trainings',
    underscored: true
});

Training.associate = (models) => {

    Training.belongsTo(models.User, { foreignKey: 'user_id' });

};

module.exports = Training;