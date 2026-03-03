const Professional = require('../models/Professional');

const ProfessionalService = {
  createProfessional: (data) => Professional.create(data),
  getAllProfessionals: () => Professional.find().populate('userId', '-password').lean(),
  getProfessionalById: (id) => Professional.findById(id).populate('userId', '-password').lean(),
  updateProfessional: async (id, data) => {
    const updated = await Professional.findByIdAndUpdate(id, data, { new: true });
    return updated ? [1] : [0];
  },
  deleteProfessional: async (id) => {
    const deleted = await Professional.findByIdAndDelete(id);
    return deleted ? 1 : 0;
  },
  getProfessionalsByType: (type) => Professional.find({ type }).populate('userId', '-password').lean(),
  getTopRatedProfessionals: (limit) => Professional.find().sort({ weighted_rating: -1 }).limit(limit).populate('userId', '-password').lean(),
  getProfileViewsLast7Days: async (id) => {
    // Apenas incrementa as views como exemplo base
    const prof = await Professional.findByIdAndUpdate(id, { $inc: { profile_views_7: 1 } }, { new: true });
    return prof ? prof.profile_views_7 : 0;
  },
  getProfessionalsBySpecialization: (specialization) => Professional.find({ type: specialization }).populate('userId', '-password').lean()
};

module.exports = ProfessionalService;