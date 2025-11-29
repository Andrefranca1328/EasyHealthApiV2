const { sequelize } = require('../config/db');
const Training = require('../models/Training');

const TrainingService = {
  createTraining: (trainingData) => Training.create(trainingData),

  getAllTrainings: () =>
    Training.find().populate('userId').populate('professionalId').lean(),

  getTrainingById: (id) =>
    Training.findById(id).populate('userId').populate('professionalId').lean(),

  updateTraining: (id, trainingData) =>
    Training.findByIdAndUpdate(id, trainingData, { new: true }),

  deleteTraining: (id) => Training.findByIdAndDelete(id)
};

module.exports = TrainingService;
