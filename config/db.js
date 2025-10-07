const Sequelize = require('sequelize');

const sequelize = new Sequelize('easyhealthdb', 'root', 'Ll@41616790@', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql'
});

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}