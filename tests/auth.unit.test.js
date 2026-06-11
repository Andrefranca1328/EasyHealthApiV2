/**
 * Testes Unitários – AuthService (login + register)
 * Tecnologia: Jest
 * Categoria CI/CD: Unitário
 *
 * Mocks utilizados:
 *  - ../models/User  → simula User.findOne() e User.create() sem banco de dados
 *  - bcrypt          → simula hash e comparação de senha
 *  - jsonwebtoken    → simula geração de token JWT
 */

// ─── Mocks antes do require ───────────────────────────────────────────────────
jest.mock('../src/models/User');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const User    = require('../src/models/User');
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');

// Garante que o dotenv não quebre em CI (sem .env real)
process.env.JWT_SECRET = 'test_secret';

const AuthService = require('../src/services/AuthService');

// ─────────────────────────────────────────────────────────────────────────────
// Suite 1 – login()
// ─────────────────────────────────────────────────────────────────────────────
describe('AuthService – login()', () => {

    beforeEach(() => jest.clearAllMocks());

    // ── CASO 1: Login bem-sucedido ────────────────────────────────────────────
    test('deve retornar token e dados do usuário quando as credenciais são válidas', async () => {
        const fakeUser = {
            _id:   'user123',
            email: 'daniel@easyhealth.com',
            role:  'trainer',
            password: 'hashed_password',
            _doc: {
                _id:   'user123',
                email: 'daniel@easyhealth.com',
                role:  'trainer',
                password: 'hashed_password',
            }
        };

        User.findOne.mockResolvedValue(fakeUser);
        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue('mocked.jwt.token');

        const result = await AuthService.login('daniel@easyhealth.com', 'password123');

        expect(User.findOne).toHaveBeenCalledWith({ email: 'daniel@easyhealth.com' });
        expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed_password');
        expect(jwt.sign).toHaveBeenCalled();
        expect(result).toHaveProperty('token', 'mocked.jwt.token');
        expect(result.user).not.toHaveProperty('password');
    });

    // ── CASO 2: E-mail não encontrado ─────────────────────────────────────────
    test('deve lançar erro quando o e-mail não está cadastrado', async () => {
        User.findOne.mockResolvedValue(null);

        await expect(
            AuthService.login('naoexiste@easyhealth.com', 'qualquersenha')
        ).rejects.toThrow('Email ou senha inválidos.');

        expect(User.findOne).toHaveBeenCalledTimes(1);
        expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    // ── CASO 3: Senha incorreta ───────────────────────────────────────────────
    test('deve lançar erro quando a senha está incorreta', async () => {
        const fakeUser = {
            _id:      'user456',
            email:    'andre@easyhealth.com',
            password: 'hashed_password',
            _doc:     { _id: 'user456', email: 'andre@easyhealth.com', password: 'hashed_password' }
        };

        User.findOne.mockResolvedValue(fakeUser);
        bcrypt.compare.mockResolvedValue(false);

        await expect(
            AuthService.login('andre@easyhealth.com', 'senha_errada')
        ).rejects.toThrow('Email ou senha inválidos.');

        expect(bcrypt.compare).toHaveBeenCalledWith('senha_errada', 'hashed_password');
        expect(jwt.sign).not.toHaveBeenCalled();
    });

    // ── CASO 4: token não deve conter a senha ─────────────────────────────────
    test('o objeto retornado não deve expor o campo password', async () => {
        const fakeUser = {
            _id:   'user789',
            email: 'gustavo@easyhealth.com',
            role:  'admin',
            password: 'hashed_password',
            _doc: {
                _id:      'user789',
                email:    'gustavo@easyhealth.com',
                role:     'admin',
                password: 'hashed_password',
            }
        };

        User.findOne.mockResolvedValue(fakeUser);
        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue('another.jwt.token');

        const result = await AuthService.login('gustavo@easyhealth.com', 'abc123');

        expect(result.user).not.toHaveProperty('password');
        expect(result).toHaveProperty('token');
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// Suite 2 – register()
// ─────────────────────────────────────────────────────────────────────────────
describe('AuthService – register()', () => {

    beforeEach(() => jest.clearAllMocks());

    const userData = {
        name:      'João Teste',
        email:     'joao@easyhealth.com',
        password:  'senha123',
        cpf:       '12345678901',
        phone:     '11999999999',
        birthdate: '1990-01-01',
        address:   'Rua das Flores, 42',
        role:      'trainer'
    };

    // ── CASO 5: Cadastro bem-sucedido ─────────────────────────────────────────
    test('deve criar e retornar o usuário sem o campo password', async () => {
        User.findOne.mockResolvedValue(null);      // nenhum usuário duplicado
        bcrypt.hash.mockResolvedValue('hashed_senha123');

        const createdDoc = {
            ...userData,
            _id: 'newuser001',
            password: 'hashed_senha123',
            _doc: {
                ...userData,
                _id: 'newuser001',
                password: 'hashed_senha123',
            }
        };
        User.create.mockResolvedValue(createdDoc);

        const result = await AuthService.register(userData);

        expect(User.findOne).toHaveBeenCalledTimes(1);
        expect(bcrypt.hash).toHaveBeenCalledWith('senha123', 10);
        expect(User.create).toHaveBeenCalledWith({
            ...userData,
            password: 'hashed_senha123'
        });
        expect(result).not.toHaveProperty('password');
        expect(result).toHaveProperty('email', 'joao@easyhealth.com');
    });

    // ── CASO 6: E-mail ou CPF já cadastrado ───────────────────────────────────
    test('deve lançar erro se e-mail ou CPF já estiver cadastrado', async () => {
        User.findOne.mockResolvedValue({ _id: 'existing', email: userData.email });

        await expect(
            AuthService.register(userData)
        ).rejects.toThrow('Email ou CPF já cadastrado.');

        expect(bcrypt.hash).not.toHaveBeenCalled();
        expect(User.create).not.toHaveBeenCalled();
    });

    // ── CASO 7: Senha deve ser armazenada como hash ───────────────────────────
    test('a senha armazenada deve ser o hash, nunca o texto puro', async () => {
        User.findOne.mockResolvedValue(null);
        bcrypt.hash.mockResolvedValue('$2b$10$hashbcryptfake');

        const createdDoc = {
            ...userData,
            _id: 'newuser002',
            password: '$2b$10$hashbcryptfake',
            _doc: {
                ...userData,
                _id: 'newuser002',
                password: '$2b$10$hashbcryptfake',
            }
        };
        User.create.mockResolvedValue(createdDoc);

        await AuthService.register(userData);

        // Verifica que create foi chamado com o hash, não com a senha original
        const callArg = User.create.mock.calls[0][0];
        expect(callArg.password).toBe('$2b$10$hashbcryptfake');
        expect(callArg.password).not.toBe('senha123');
    });
});
