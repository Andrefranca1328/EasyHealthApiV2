const { sequelize } = require('../config/db');
const consulta = require('../models/consulta');

const ConsultaService = {

    createConsulta: (consultaData) => {
        return consulta.create(consultaData);
    },

    getAllConsulta: () => {
        return consulta.findAll();
    },

    getConsultaById: (id) => {
        return consulta.findByPk(id);
    },

    updateConsulta: (id, consultaData) => {
        return consulta.update(consultaData, { where: { id } });
    },

    deleteConsulta: (id) => {
        return consulta.destroy({ where: { id } });
    }

};
module.exports = ConsultaService;