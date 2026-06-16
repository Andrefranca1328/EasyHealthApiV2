// src/controllers/AdminController.js

const AdminService = require('../services/AdminService');

const AdminController = {

    /**
     * GET /api/admin/professionals/pending
     * Lista profissionais aguardando aprovação.
     */
    getPendingProfessionals: async (req, res, next) => {
        try {
            const professionals = await AdminService.getPendingProfessionals();
            res.status(200).json(professionals);
        } catch (error) {
            next(error);
        }
    },

    /**
     * GET /api/admin/professionals
     * Lista TODOS os profissionais (painel admin).
     */
    getAllProfessionals: async (req, res, next) => {
        try {
            const professionals = await AdminService.getAllProfessionals();
            res.status(200).json(professionals);
        } catch (error) {
            next(error);
        }
    },

    /**
     * PATCH /api/admin/professionals/:id/status
     * Aprova ou reprova um profissional.
     * Body: { status: 'approved' | 'rejected', rejectionReason?: string }
     */
    updateProfessionalStatus: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { status, rejectionReason } = req.body;

            const updated = await AdminService.updateProfessionalStatus(id, status, rejectionReason);
            res.status(200).json({
                message: `Profissional ${status === 'approved' ? 'aprovado' : 'reprovado'} com sucesso.`,
                professional: updated
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * PATCH /api/admin/users/:id/role
     * Atualiza o role de um usuário (ex: promover para admin).
     * Body: { role: 'admin' | 'user' | 'trainer' | 'nutritionist' }
     */
    updateUserRole: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { role } = req.body;

            const updated = await AdminService.updateUserRole(id, role);
            res.status(200).json({
                message: `Role do usuário atualizado para "${role}".`,
                user: updated
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = AdminController;
