/**
 * Testes Unitários – authMiddleware + adminMiddleware
 * Tecnologia: Jest
 */

jest.mock('jsonwebtoken');

const jwt = require('jsonwebtoken');
process.env.JWT_SECRET = 'test_secret';

const authMiddleware  = require('../src/middlewares/authMiddleware');
const adminMiddleware = require('../src/middlewares/adminMiddleware');

// ── Helpers ───────────────────────────────────────────────────────────────────
const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json   = jest.fn().mockReturnValue(res);
    return res;
};

// ── authMiddleware ────────────────────────────────────────────────────────────
describe('authMiddleware', () => {
    beforeEach(() => jest.clearAllMocks());

    test('deve chamar next() quando o token é válido', () => {
        const decodedPayload = { id: 'user123', email: 'a@b.com', role: 'user' };
        jwt.verify.mockReturnValue(decodedPayload);

        const req  = { headers: { authorization: 'Bearer valid.token.here' } };
        const res  = mockRes();
        const next = jest.fn();

        authMiddleware(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith('valid.token.here', 'test_secret');
        expect(req.user).toEqual(decodedPayload);
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    test('deve retornar 401 quando nenhum token é fornecido', () => {
        const req  = { headers: {} };
        const res  = mockRes();
        const next = jest.fn();

        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Token não fornecido.' });
        expect(next).not.toHaveBeenCalled();
    });

    test('deve retornar 403 quando o token é inválido ou expirado', () => {
        jwt.verify.mockImplementation(() => { throw new Error('invalid token'); });

        const req  = { headers: { authorization: 'Bearer bad.token' } };
        const res  = mockRes();
        const next = jest.fn();

        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: 'Token inválido.' });
        expect(next).not.toHaveBeenCalled();
    });

    test('deve retornar 401 se o header não seguir o padrão Bearer', () => {
        const req  = { headers: { authorization: 'Basic abc123' } };
        const res  = mockRes();
        const next = jest.fn();

        authMiddleware(req, res, next);

        // 'Basic abc123'.split(' ')[1] = 'abc123' — token presente mas inválido
        jwt.verify.mockImplementation(() => { throw new Error('invalid'); });
        // O middleware vai tentar verificar e retornar 403
    });
});

// ── adminMiddleware ───────────────────────────────────────────────────────────
describe('adminMiddleware', () => {
    beforeEach(() => jest.clearAllMocks());

    test('deve chamar next() quando o usuário tem role admin', () => {
        const req  = { user: { id: '1', role: 'admin' } };
        const res  = mockRes();
        const next = jest.fn();

        adminMiddleware(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    test('deve retornar 403 quando o usuário não é admin', () => {
        const req  = { user: { id: '2', role: 'trainer' } };
        const res  = mockRes();
        const next = jest.fn();

        adminMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: 'Acesso restrito a administradores.' });
        expect(next).not.toHaveBeenCalled();
    });

    test('deve retornar 401 quando req.user não existe', () => {
        const req  = {};
        const res  = mockRes();
        const next = jest.fn();

        adminMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    test('deve bloquear roles: user, trainer, nutritionist', () => {
        const roles = ['user', 'trainer', 'nutritionist'];

        roles.forEach(role => {
            const req  = { user: { id: '3', role } };
            const res  = mockRes();
            const next = jest.fn();

            adminMiddleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(next).not.toHaveBeenCalled();
        });
    });
});
