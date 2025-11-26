// Removida importação desnecessária 'const { get } = require('../routes/consultaRoutes');'
const ProfessionalService = require('../services/ProfessionalService');

const ProfessionalController = {   
    createProfessional: async (req, res) => {
        try {
            const professional = await ProfessionalService.createProfessional(req.body);
            res.status(201).json(professional);
        } catch (error) {
            console.error('Error creating professional:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }, 
    getAllProfessionals: async (req, res) => {
        try {
            const professionals = await ProfessionalService.getAllProfessionals();
            res.status(200).json(professionals);
        } catch (error) {
            console.error('Error fetching all professionals:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    getProfessionalById: async (req, res) => {
        try {
            const { id } = req.params; 
            const professional = await ProfessionalService.getProfessionalById(id);

            if (!professional) {
                return res.status(404).json({ error: "Professional not found" }); 
            }

            // Retorna o objeto do profissional
            return res.json(professional);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    updateProfessional: async (req, res) => {
        try {
            const { id } = req.params;
            const updatedProfessional = await ProfessionalService.updateProfessional(id, req.body);
            if (updatedProfessional[0] === 1) {
                res.status(200).json({ message: 'Professional updated successfully' });
            } else {
                res.status(404).json({ error: 'Professional not found' });
            }
        } catch (error) {
            console.error('Error updating professional:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    deleteProfessional: async (req, res) => {
        try {
            const { id } = req.params;
            const deleted = await ProfessionalService.deleteProfessional(id);
            if (deleted) {
                res.status(204).send();
            } else {
                res.status(404).json({ error: 'Professional not found' });
            }
        } catch (error) {
            console.error('Error deleting professional:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    getProfessionalsByType: async (req, res) => {
        try {
            const { type } = req.params;
            const professionals = await ProfessionalService.getProfessionalsByType(type);
            res.status(200).json(professionals);
        } catch (error) {
            console.error('Error fetching professionals by type:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    getTopRatedProfessionals: async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const professionals = await ProfessionalService.getTopRatedProfessionals(limit);
            res.status(200).json(professionals);
        } catch (error) {
            console.error('Error fetching top-rated professionals:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    getProfileViewsLast7Days: async (req, res) => {
        try {
            const { id } = req.params;
            const views = await ProfessionalService.getProfileViewsLast7Days(id);
            
            const professional = await ProfessionalService.getProfessionalById(id);

            res.status(200).json({ 
                message: `Métrica profile_views_7 atualizada.`,
                count: views,
                professional: professional 
            });
        } catch (error) {
            console.error('Error fetching profile views for the last 7 days:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    getProfessionalsBySpecialization: async (req, res) => {
        try {
            const { specialization } = req.params;
            const professionals = await ProfessionalService.getProfessionalsBySpecialization(specialization);
            res.status(200).json(professionals);
        } catch (error) {
            console.error('Error fetching professionals by specialization:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = ProfessionalController;