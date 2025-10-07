const db = require('../config/db');
const Sequelize = db.Sequelize;

const Training = db.sequelize.define('trainings', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    description: { type: Sequelize.STRING, allowNull: false },
    duration: { type: Sequelize.INTEGER, allowNull: false }, // minutes
    date: { type: Sequelize.DATEONLY, allowNull: false },
    userId: { type: Sequelize.INTEGER, allowNull: false }
}, {
    tableName: 'trainings',
    underscored: true
});



module.exports = Training;