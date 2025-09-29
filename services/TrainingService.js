const { sequelize } = require('../config/db');
const Training = require('../models/Training');

const TrainingService = {

    createTraining: (trainingData) => {
        return Training.create(trainingData);
    },

    getAllTrainings: () => {
        return Training.findAll();
    },

    getTrainingById: (id) => {
        return Training.findByPk(id);
    },

    updateTraining: (id, trainingData) => {
        return Training.update(trainingData, { where: { id } });
    },

    deleteTraining: (id) => {
        return Training.destroy({ where: { id } });
    }

};

sequelize.sync({ force: true });

module.exports = TrainingService;
