/**
 * Testes Unitários – UserService
 * Tecnologia: Jest
 */

jest.mock('../src/models/User');
const User = require('../src/models/User');

const UserService = require('../src/services/UserService');

const fakeUser = {
    _id: 'user001',
    name: 'João',
    email: 'joao@test.com',
    role: 'user'
};

describe('UserService – getAllUsers()', () => {
    beforeEach(() => jest.clearAllMocks());

    test('deve retornar lista de usuários sem senha', async () => {
        User.find.mockReturnValue({
            select: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue([fakeUser]) })
        });

        const result = await UserService.getAllUsers();
        expect(User.find).toHaveBeenCalled();
        expect(result).toEqual([fakeUser]);
    });
});

describe('UserService – getUserById()', () => {
    beforeEach(() => jest.clearAllMocks());

    test('deve retornar o usuário pelo ID', async () => {
        User.findById.mockReturnValue({
            select: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue(fakeUser) })
        });

        const result = await UserService.getUserById('user001');
        expect(User.findById).toHaveBeenCalledWith('user001');
        expect(result).toEqual(fakeUser);
    });

    test('deve retornar null se o usuário não existir', async () => {
        User.findById.mockReturnValue({
            select: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue(null) })
        });

        const result = await UserService.getUserById('naoexiste');
        expect(result).toBeNull();
    });
});

describe('UserService – updateUser()', () => {
    beforeEach(() => jest.clearAllMocks());

    test('deve retornar o documento atualizado', async () => {
        const updatedUser = { ...fakeUser, name: 'João Atualizado' };
        User.findByIdAndUpdate.mockReturnValue({
            select: jest.fn().mockResolvedValue(updatedUser)
        });

        const result = await UserService.updateUser('user001', { name: 'João Atualizado' });
        expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
            'user001',
            { name: 'João Atualizado' },
            { new: true, runValidators: true }
        );
        expect(result).toEqual(updatedUser);
    });

    test('deve retornar null se o usuário não existir', async () => {
        User.findByIdAndUpdate.mockReturnValue({
            select: jest.fn().mockResolvedValue(null)
        });

        const result = await UserService.updateUser('naoexiste', { name: 'X' });
        expect(result).toBeNull();
    });
});

describe('UserService – deleteUser()', () => {
    beforeEach(() => jest.clearAllMocks());

    test('deve retornar o documento deletado', async () => {
        User.findByIdAndDelete.mockResolvedValue(fakeUser);

        const result = await UserService.deleteUser('user001');
        expect(User.findByIdAndDelete).toHaveBeenCalledWith('user001');
        expect(result).toEqual(fakeUser);
    });

    test('deve retornar null se o usuário não existir', async () => {
        User.findByIdAndDelete.mockResolvedValue(null);

        const result = await UserService.deleteUser('naoexiste');
        expect(result).toBeNull();
    });
});
