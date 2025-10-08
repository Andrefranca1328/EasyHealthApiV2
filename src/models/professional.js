const db = require('../config/db');
const Sequelize = db.Sequelize;

const Professional = db.sequelize.define('professional', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true    
    },
    userId: {
      type: Sequelize.INTEGER,
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
        type: Sequelize.ENUM('nutritionist', 'personal_trainer'),
        allowNull: false
    },
    specialty: {
        type: Sequelize.STRING,
        allowNull: false
    }, 
    weighted_rating: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    profile_views_7: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },hire_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
  tableName: 'professional',
  underscored: true,
  timestamps: true 
});

module.exports = Professional;