const TrainingService = require('../services/TrainingService');

const TrainingController = {

    createTraining: async (req, res) => {
        try {
            const training = await TrainingService.createTraining(req.body);
            res.status(201).json(training);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    getAllTrainings: async (req, res) => {
        try {
            const trainings = await TrainingService.getAllTrainings();
            res.status(200).json(trainings);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    getTrainingById: async (req, res) => {
        try {
            const training = await TrainingService.getTrainingById(req.params.id);
            if (!training) {
                return res.status(404).json({ error: 'Training not found' });
            }
            res.status(200).json(training);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    updateTraining: async (req, res) => {
        try{
            const updated = await TrainingService.updateTraining(req.params.id, req.body);
            if (!updated) {
                return res.status(404).json({ error: 'Training not found' });
            }
            res.status(200).json({ message: 'Training updated successfully' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    deleteTraining: async (req, res) => {  
        try{
            console.log('ID para deletar:', req.params.id);
            const deleted = await TrainingService.deleteTraining(req.params.id);
            if (!deleted) {
                return res.status(404).json({ error: 'Training not found' });
            }
            res.status(200).json({ message: 'Training deleted successfully' });
        } catch (error) {
            res.status(400).json({ error: error.message }); 
        }
    }
};  

module.exports = TrainingController;