/**
 * Testes Unitários – RatingService
 * Tecnologia: Jest
 */

// Mock do mongoose ANTES do require do service
jest.mock('mongoose', () => {
    const actualMongoose = jest.requireActual('mongoose');
    return {
        ...actualMongoose,
        Types: {
            ObjectId: {
                isValid: jest.fn()
            }
        }
    };
});

jest.mock('../src/models/Rating', () => ({
    create:    jest.fn(),
    find:      jest.fn(),
    aggregate: jest.fn()
}));

jest.mock('../src/models/Professional', () => ({
    findByIdAndUpdate: jest.fn()
}));

const mongoose     = require('mongoose');
const Rating       = require('../src/models/Rating');
const Professional = require('../src/models/Professional');

const RatingService = require('../src/services/RatingService');

describe('RatingService – createRating()', () => {
    beforeEach(() => jest.clearAllMocks());

    test('deve criar uma avaliação e recalcular o ranking', async () => {
        const ratingData = {
            userId: 'user001',
            professionalId: 'prof001',
            rating: 5,
            comment: 'Ótimo!'
        };

        const newRating = { ...ratingData, _id: 'rating001', professionalId: 'prof001' };
        Rating.create.mockResolvedValue(newRating);

        mongoose.Types.ObjectId.isValid.mockReturnValue(false);
        Rating.aggregate.mockResolvedValue([
            { _id: 'prof001', averageRating: 5, totalRatings: 1 }
        ]);
        Professional.findByIdAndUpdate.mockResolvedValue({});

        const result = await RatingService.createRating(ratingData);

        expect(Rating.create).toHaveBeenCalledWith(ratingData);
        expect(result._id).toBe('rating001');
    });
});

describe('RatingService – getRatingsByProfessional()', () => {
    beforeEach(() => jest.clearAllMocks());

    test('deve retornar avaliações de um profissional', async () => {
        const fakeRatings = [
            { _id: 'r1', rating: 5, comment: 'Ótimo!', userId: 'u1', professionalId: 'p1' }
        ];
        Rating.find.mockReturnValue({ lean: jest.fn().mockResolvedValue(fakeRatings) });

        const result = await RatingService.getRatingsByProfessional('p1');

        expect(Rating.find).toHaveBeenCalledWith({ professionalId: 'p1' });
        expect(result).toEqual(fakeRatings);
    });

    test('deve retornar lista vazia se não houver avaliações', async () => {
        Rating.find.mockReturnValue({ lean: jest.fn().mockResolvedValue([]) });

        const result = await RatingService.getRatingsByProfessional('sem_avaliacoes');
        expect(result).toEqual([]);
    });
});

describe('RatingService – calculateWeightedRating()', () => {
    beforeEach(() => jest.clearAllMocks());

    test('deve calcular e atualizar o rating ponderado Bayesiano', async () => {
        mongoose.Types.ObjectId.isValid.mockReturnValue(false);
        Rating.aggregate.mockResolvedValue([
            { _id: 'prof001', averageRating: 4.5, totalRatings: 10 }
        ]);
        Professional.findByIdAndUpdate.mockResolvedValue({});

        const result = await RatingService.calculateWeightedRating('prof001');

        expect(Rating.aggregate).toHaveBeenCalled();
        expect(Professional.findByIdAndUpdate).toHaveBeenCalledWith(
            'prof001',
            expect.objectContaining({
                weighted_rating: expect.any(Number),
                total_ratings: 10
            })
        );
        expect(result).toHaveProperty('weightedRating');
        expect(result).toHaveProperty('totalRatings', 10);
    });

    test('deve usar valores padrão (C=5, m=4.0) quando não há avaliações', async () => {
        mongoose.Types.ObjectId.isValid.mockReturnValue(false);
        Rating.aggregate.mockResolvedValue([]); // nenhuma avaliação
        Professional.findByIdAndUpdate.mockResolvedValue({});

        const result = await RatingService.calculateWeightedRating('prof_novo');
        // Com totalRatings=0 e averageRating=0: weightedRating = (0 + 4*5)/(0+5) = 4.0
        expect(result.weightedRating).toBeCloseTo(4.0);
        expect(result.totalRatings).toBe(0);
    });
});
