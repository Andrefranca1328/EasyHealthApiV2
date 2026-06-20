// src/controllers/professionalController.js

const ProfessionalService = require('../services/ProfessionalService');
const storageService       = require('../services/storageService');

const ProfessionalController = {

    /**
     * POST /api/professionals
     * Cadastra novo profissional com upload de documento PDF.
     */
    createProfessional: async (req, res, next) => {
        try {
            let documentPath = '';
            if (req.file) {
                documentPath = storageService.getFilePath(req.file);
            } else if (req.body.document) {
                documentPath = req.body.document;
            } else {
                return res.status(400).json({ error: 'Nenhum arquivo ou documento comprobatório recebido.' });
            }

            const professional = await ProfessionalService.createProfessional({
                ...req.body,
                document: documentPath
            });
            res.status(201).json(professional);
        } catch (error) {
            next(error);
        }
    },

    /**
     * GET /api/professionals
     * Lista profissionais APROVADOS com filtros opcionais.
     * Query: ?type=Nutricionista&city=SP&minRating=4
     */
    getAllProfessionals: async (req, res, next) => {
        try {
            const { type, city, minRating } = req.query;
            const professionals = await ProfessionalService.getAllApproved({ type, city, minRating });
            res.status(200).json(professionals);
        } catch (error) {
            next(error);
        }
    },

    searchProfessionals: async (req, res, next) => {
        try {
            const { page, limit, city, modality, minPrice, maxPrice, minRating, sortBy } = req.query;
            const result = await ProfessionalService.searchApproved({
                page,
                limit,
                city,
                modality,
                minPrice,
                maxPrice,
                minRating,
                sortBy
            });
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },

    getFilterOptions: async (req, res, next) => {
        try {
            const options = await ProfessionalService.getFilterOptions();
            res.status(200).json(options);
        } catch (error) {
            next(error);
        }
    },

    getProfessionalById: async (req, res, next) => {
        try {
            const professional = await ProfessionalService.getProfessionalById(req.params.id);
            if (!professional) {
                return res.status(404).json({ error: 'Profissional não encontrado.' });
            }
            res.status(200).json(professional);
        } catch (error) {
            next(error);
        }
    },

    updateProfessional: async (req, res, next) => {
        try {
            const updated = await ProfessionalService.updateProfessional(req.params.id, req.body);
            if (!updated) {
                return res.status(404).json({ error: 'Profissional não encontrado.' });
            }
            res.status(200).json(updated);
        } catch (error) {
            next(error);
        }
    },

    deleteProfessional: async (req, res, next) => {
        try {
            const deleted = await ProfessionalService.deleteProfessional(req.params.id);
            if (!deleted) {
                return res.status(404).json({ error: 'Profissional não encontrado.' });
            }
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    },

    getProfessionalsByType: async (req, res, next) => {
        try {
            const professionals = await ProfessionalService.getProfessionalsByType(req.params.type);
            res.status(200).json(professionals);
        } catch (error) {
            next(error);
        }
    },

    getTopRatedProfessionals: async (req, res, next) => {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const professionals = await ProfessionalService.getTopRatedProfessionals(limit);
            res.status(200).json(professionals);
        } catch (error) {
            next(error);
        }
    },

    getProfileViewsLast7Days: async (req, res, next) => {
        try {
            const { id } = req.params;
            const views        = await ProfessionalService.getProfileViewsLast7Days(id);
            const professional = await ProfessionalService.getProfessionalById(id);

            res.status(200).json({
                message: 'Métrica profile_views_7 atualizada.',
                count: views,
                professional
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = ProfessionalController;