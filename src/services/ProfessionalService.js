const { sequelize } = require('../config/db');
const professional = require('../models/professional');

const ProfessionalService = {

    createProfessional: (professionalData) => {
        return professional.create(professionalData);
    }, 
    getAllProfessionals: () => {
        return professional.findAll();
    },

    getProfessionalById: (id) => {
        return professional.findByPk(id);
    },     
    updateProfessional: (id, professionalData) => {
        return professional.update(professionalData, { where: { id } });
    },

    deleteProfessional: (id) => {
        return professional.destroy({ where: { id } });
    } 
};
module.exports = ProfessionalService;