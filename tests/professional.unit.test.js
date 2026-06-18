/**
 * Testes Unitários – ProfessionalService
 * Tecnologia: Jest
 */

jest.mock('../src/models/Professional');
const Professional = require('../src/models/Professional');

const ProfessionalService = require('../src/services/ProfessionalService');

const fakeProfessional = {
    _id: 'prof001',
    userId: 'user001',
    type: 'Personal Trainer',
    status: 'approved',
    city: 'São Paulo',
    weighted_rating: 4.7,
    total_ratings: 10,
    profile_views_7: 25
};

// Helper para cadeia .populate().sort().lean()
const chainMock = (value) => ({
    populate: jest.fn().mockReturnThis(),
    sort:     jest.fn().mockReturnThis(),
    limit:    jest.fn().mockReturnThis(),
    lean:     jest.fn().mockResolvedValue(value)
});

describe('ProfessionalService – createProfessional()', () => {
    beforeEach(() => jest.clearAllMocks());

    test('deve criar e retornar um profissional', async () => {
        Professional.create.mockResolvedValue(fakeProfessional);
        const result = await ProfessionalService.createProfessional(fakeProfessional);
        expect(Professional.create).toHaveBeenCalledWith(fakeProfessional);
        expect(result).toEqual(fakeProfessional);
    });
});

describe('ProfessionalService – getAllApproved()', () => {
    beforeEach(() => jest.clearAllMocks());

    test('deve listar apenas profissionais aprovados', async () => {
        Professional.find.mockReturnValue(chainMock([fakeProfessional]));

        const result = await ProfessionalService.getAllApproved();
        expect(Professional.find).toHaveBeenCalledWith({ status: 'approved' });
        expect(result).toEqual([fakeProfessional]);
    });

    test('deve aplicar filtro de tipo', async () => {
        Professional.find.mockReturnValue(chainMock([fakeProfessional]));

        await ProfessionalService.getAllApproved({ type: 'Personal Trainer' });
        expect(Professional.find).toHaveBeenCalledWith({
            status: 'approved',
            type: 'Personal Trainer'
        });
    });

    test('deve aplicar filtro de minRating', async () => {
        Professional.find.mockReturnValue(chainMock([fakeProfessional]));

        await ProfessionalService.getAllApproved({ minRating: '4' });
        expect(Professional.find).toHaveBeenCalledWith({
            status: 'approved',
            weighted_rating: { $gte: 4 }
        });
    });
});

describe('ProfessionalService – getProfessionalById()', () => {
    beforeEach(() => jest.clearAllMocks());

    test('deve retornar o profissional pelo ID', async () => {
        Professional.findById.mockReturnValue(chainMock(fakeProfessional));

        const result = await ProfessionalService.getProfessionalById('prof001');
        expect(Professional.findById).toHaveBeenCalledWith('prof001');
        expect(result).toEqual(fakeProfessional);
    });

    test('deve retornar null se não encontrado', async () => {
        Professional.findById.mockReturnValue(chainMock(null));
        const result = await ProfessionalService.getProfessionalById('naoexiste');
        expect(result).toBeNull();
    });
});

describe('ProfessionalService – updateProfessional()', () => {
    beforeEach(() => jest.clearAllMocks());

    test('deve retornar o documento atualizado', async () => {
        const updated = { ...fakeProfessional, city: 'Campinas' };
        Professional.findByIdAndUpdate.mockResolvedValue(updated);

        const result = await ProfessionalService.updateProfessional('prof001', { city: 'Campinas' });
        expect(result).toEqual(updated);
    });

    test('deve retornar null se não encontrado', async () => {
        Professional.findByIdAndUpdate.mockResolvedValue(null);
        const result = await ProfessionalService.updateProfessional('naoexiste', {});
        expect(result).toBeNull();
    });
});

describe('ProfessionalService – getTopRatedProfessionals()', () => {
    beforeEach(() => jest.clearAllMocks());

    test('deve retornar profissionais ordenados por nota (limite padrão)', async () => {
        Professional.find.mockReturnValue(chainMock([fakeProfessional]));

        const result = await ProfessionalService.getTopRatedProfessionals(10);
        expect(Professional.find).toHaveBeenCalledWith({ status: 'approved' });
        expect(result).toEqual([fakeProfessional]);
    });
});

describe('ProfessionalService – getProfileViewsLast7Days()', () => {
    beforeEach(() => jest.clearAllMocks());

    test('deve incrementar e retornar o contador de views', async () => {
        Professional.findByIdAndUpdate.mockResolvedValue({ ...fakeProfessional, profile_views_7: 26 });

        const result = await ProfessionalService.getProfileViewsLast7Days('prof001');

        expect(Professional.findByIdAndUpdate).toHaveBeenCalledWith(
            'prof001',
            { $inc: { profile_views_7: 1 } },
            { new: true }
        );
        expect(result).toBe(26);
    });

    test('deve retornar 0 se o profissional não existir', async () => {
        Professional.findByIdAndUpdate.mockResolvedValue(null);
        const result = await ProfessionalService.getProfileViewsLast7Days('naoexiste');
        expect(result).toBe(0);
    });
});
