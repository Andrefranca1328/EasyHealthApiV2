const db = require('../config/db');

const Consulta = db.sequelize.define('consulta', {
    id: {
        type: db.Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    data_hora: {
        type: db.Sequelize.DATE,
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
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    status: {
        type: db.Sequelize.ENUM('agendada', 'concluida', 'cancelada'),
        allowNull: false,
        defaultValue: 'agendada'
    }
}, {
    tableName: 'consulta',
    underscored: true,
    timestamps: true 
});

Consulta.associate = (models) => {
    Consulta.belongsTo(models.User, { foreignKey: 'user_id' });
    
};

module.exports = Consulta;