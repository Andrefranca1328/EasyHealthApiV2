// src/services/TrainingService.js

const Training = require('../models/Training');

const TrainingService = {
    createTraining: (trainingData) => Training.create(trainingData),

    /**
     * Lista treinos com filtros opcionais por userId e/ou professionalId.
     */
    getAllTrainings({ userId, professionalId } = {}) {
        const query = {};
        if (userId)         query.userId         = userId;
        if (professionalId) query.professionalId = professionalId;

        return Training.find(query)
            .populate('userId', 'name email')
            .populate('professionalId', 'type city')
            .sort({ date: -1 })
            .lean();
    },

    getTrainingById: (id) =>
        Training.findById(id)
            .populate('userId', 'name email')
            .populate('professionalId', 'type city')
            .lean(),

    updateTraining: (id, trainingData) =>
        Training.findByIdAndUpdate(id, trainingData, { new: true }),

    deleteTraining: (id) => Training.findByIdAndDelete(id)
};

module.exports = TrainingService;
