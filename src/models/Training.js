const db = require('../config/db');
const Sequelize = db.Sequelize;

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
  }, // minutes
  date: { 
    type: db.Sequelize.DATEONLY, 
    allowNull: false 
  },
  userId: { 
    type: db.Sequelize.INTEGER, 
    allowNull: false 
  }
}, {
  tableName: 'trainings',
  underscored: true
});

module.exports = Training;