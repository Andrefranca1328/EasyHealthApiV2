const db = require('../config/db');
const Sequelize = db.Sequelize;

const Consulta = db.sequelize.define('consulta', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  data_hora: {
    type: Sequelize.DATE,
    allowNull: false
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
  status: {
    type: Sequelize.ENUM('agendada', 'concluida', 'cancelada'),
    allowNull: false,
    defaultValue: 'agendada'
  }
}, {
  tableName: 'consulta',
  underscored: true,
  timestamps: true 
});

module.exports = Consulta;