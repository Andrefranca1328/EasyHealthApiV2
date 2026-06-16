/**
 * Testes Unitários – TrainingService
 * Tecnologia: Jest
 */

jest.mock('../src/models/Training');
const Training = require('../src/models/Training');

const TrainingService = require('../src/services/TrainingService');

const fakeTraining = {
    _id: 'training001',
    description: 'Treino de pernas',
    duration: 60,
    date: new Date('2026-06-15'),
    userId: 'user001',
    professionalId: 'prof001'
};

// Helper para mockar a cadeia .populate().populate().sort().lean()
const chainMock = (value) => ({
    populate: jest.fn().mockReturnThis(),
    sort:     jest.fn().mockReturnThis(),
    lean:     jest.fn().mockResolvedValue(value)
});

describe('TrainingService – createTraining()', () => {
    beforeEach(() => jest.clearAllMocks());

    test('deve criar e retornar um treino', async () => {
        Training.create.mockResolvedValue(fakeTraining);

        const result = await TrainingService.createTraining(fakeTraining);
        expect(Training.create).toHaveBeenCalledWith(fakeTraining);
        expect(result).toEqual(fakeTraining);
    });
});

describe('TrainingService – getAllTrainings()', () => {
    beforeEach(() => jest.clearAllMocks());

    test('deve retornar todos os treinos sem filtro', async () => {
        Training.find.mockReturnValue(chainMock([fakeTraining]));

        const result = await TrainingService.getAllTrainings();
        expect(Training.find).toHaveBeenCalledWith({});
        expect(result).toEqual([fakeTraining]);
    });

    test('deve filtrar treinos por userId', async () => {
        Training.find.mockReturnValue(chainMock([fakeTraining]));

        await TrainingService.getAllTrainings({ userId: 'user001' });
        expect(Training.find).toHaveBeenCalledWith({ userId: 'user001' });
    });

    test('deve filtrar treinos por professionalId', async () => {
        Training.find.mockReturnValue(chainMock([fakeTraining]));

        await TrainingService.getAllTrainings({ professionalId: 'prof001' });
        expect(Training.find).toHaveBeenCalledWith({ professionalId: 'prof001' });
    });
});

describe('TrainingService – getTrainingById()', () => {
    beforeEach(() => jest.clearAllMocks());

    test('deve retornar o treino pelo ID', async () => {
        Training.findById.mockReturnValue(chainMock(fakeTraining));

        const result = await TrainingService.getTrainingById('training001');
        expect(Training.findById).toHaveBeenCalledWith('training001');
        expect(result).toEqual(fakeTraining);
    });

    test('deve retornar null se não encontrado', async () => {
        Training.findById.mockReturnValue(chainMock(null));

        const result = await TrainingService.getTrainingById('naoexiste');
        expect(result).toBeNull();
    });
});

describe('TrainingService – updateTraining()', () => {
    beforeEach(() => jest.clearAllMocks());

    test('deve retornar o treino atualizado', async () => {
        const updated = { ...fakeTraining, description: 'Treino de costas' };
        Training.findByIdAndUpdate.mockResolvedValue(updated);

        const result = await TrainingService.updateTraining('training001', { description: 'Treino de costas' });
        expect(result).toEqual(updated);
    });
});

describe('TrainingService – deleteTraining()', () => {
    beforeEach(() => jest.clearAllMocks());

    test('deve retornar o treino deletado', async () => {
        Training.findByIdAndDelete.mockResolvedValue(fakeTraining);

        const result = await TrainingService.deleteTraining('training001');
        expect(result).toEqual(fakeTraining);
    });

    test('deve retornar null se não encontrado', async () => {
        Training.findByIdAndDelete.mockResolvedValue(null);

        const result = await TrainingService.deleteTraining('naoexiste');
        expect(result).toBeNull();
    });
});
