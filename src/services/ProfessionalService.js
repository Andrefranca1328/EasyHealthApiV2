const { sequelize, Sequelize } = require('../config/db');

const professional = require('../models/professional'); 

const { Op } = Sequelize; 
const profileViewsLog = require('../models/ProfileViewLog');


const ProfessionalService = {

    createProfessional: (professionalData) => {
        return professional.create(professionalData);
    }, 
    getAllProfessionals: () => {
        return professional.findAll();
    },

    getProfessionalById: async (id) => {
        const prof = await professional.findByPk(id); 

        if (prof) {

            await ProfessionalService.incrementProfileViews(id); 
        }

        return prof; 
    },      
    updateProfessional: (id, professionalData) => {
        return professional.update(professionalData, { where: { id } });
    },

    deleteProfessional: (id) => {
        return professional.destroy({ where: { id } });
    },
    getProfessionalsByType: (type) => {
        return professional.findAll({ where: { professional_type: type } });
    },
    getTopRatedProfessionals: (limit) => {
        return professional.findAll({
            order: [['weighted_rating', 'DESC']],
            limit
        });
    },
    incrementProfileViews: async (professional_id) => {
        try {
            await profileViewsLog.create({
                professional_id: professional_id,
                viewed_at: new Date()
            });
        } catch (error) {
            console.error('Error incrementing profile views:', error);
        }
    },

    getProfileViewsLast7Days: async (professionalId) => {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); 

        const count = await profileViewsLog.count({
            where: {
                professional_id: professionalId,
                viewed_at: {
                    [Op.gte]: sevenDaysAgo 
                }
            }
        });

        await professional.update(
            { profile_views_7: count }, 
            { where: { id: professionalId } }
        );
        
        return count;
    },
    getProfessionalsBySpecialization: (specialization) => {
        return professional.findAll({ where: { specialization } });
    }

};
module.exports = ProfessionalService;