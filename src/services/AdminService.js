// src/services/AdminService.js

const Professional = require('../models/Professional');
const User         = require('../models/User');

const AdminService = {
    /**
     * Lista profissionais com status 'pending' (aguardando aprovação).
     */
    getPendingProfessionals() {
        return Professional
            .find({ status: 'pending' })
            .populate('userId', '-password')
            .sort({ createdAt: 1 }) // mais antigos primeiro
            .lean();
    },

    /**
     * Aprova ou reprova um profissional.
     * @param {string} id - ID do Professional
     * @param {string} status - 'approved' | 'rejected'
     * @param {string} [rejectionReason] - obrigatório quando status = 'rejected'
     */
    async updateProfessionalStatus(id, status, rejectionReason) {
        const updateData = { status };
        if (status === 'rejected' && rejectionReason) {
            updateData.rejectionReason = rejectionReason;
        }

        const updated = await Professional.findByIdAndUpdate(id, updateData, { new: true })
            .populate('userId', '-password');

        if (!updated) throw new Error('Profissional não encontrado.');
        return updated;
    },

    /**
     * Promove um usuário para admin (ou outro role).
     * @param {string} id - ID do User
     * @param {string} role - novo role
     */
    async updateUserRole(id, role) {
        const updated = await User.findByIdAndUpdate(
            id,
            { role },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updated) throw new Error('Usuário não encontrado.');
        return updated;
    },

    /**
     * Lista todos os profissionais (sem filtro de status) para o painel admin.
     */
    getAllProfessionals() {
        return Professional
            .find()
            .populate('userId', '-password')
            .sort({ createdAt: -1 })
            .lean();
    }
};

module.exports = AdminService;
