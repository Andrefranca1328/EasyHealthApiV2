// src/config/swagger.js
// Configuração OpenAPI 3.0 para a EasyHealth API

const swaggerUi   = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'EasyHealth API',
            version: '2.0.0',
            description: `
## 🏋️ EasyHealth API

Plataforma que conecta **Personal Trainers** e **Nutricionistas** com seus clientes.

### Fluxo Principal
1. Usuário se registra (\`POST /api/auth/register\`)
2. Faz login e recebe um **JWT** (\`POST /api/auth/login\`)
3. Usa o JWT no header \`Authorization: Bearer <token>\` em todas as demais rotas
4. Profissional cadastra seu perfil (\`POST /api/professionals\`) — fica com status \`pending\`
5. Admin aprova o profissional (\`PATCH /api/admin/professionals/:id/status\`)
6. Profissional cria planos para clientes (\`POST /api/plans\`)
7. Clientes avaliam profissionais (\`POST /api/ratings\`)

### Roles
| Role | Acesso |
|------|--------|
| \`user\` | Cliente — agenda, vê planos, avalia |
| \`trainer\` | Personal Trainer — cria planos de treino |
| \`nutritionist\` | Nutricionista — cria planos alimentares |
| \`admin\` | Equipe interna — aprova profissionais |
            `,
            contact: {
                name: 'EasyHealth Team',
                email: 'contato@easyhealth.com'
            }
        },
        servers: [
            {
                url: process.env.API_BASE_URL || 'http://localhost:3000',
                description: 'Servidor local / produção'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Insira o token JWT obtido no login. Exemplo: **Bearer eyJhbGci...**'
                }
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        _id:          { type: 'string', example: '6650a1...' },
                        name:         { type: 'string', example: 'João Silva' },
                        email:        { type: 'string', example: 'joao@email.com' },
                        cpf:          { type: 'string', example: '000.000.000-00' },
                        phone:        { type: 'string', example: '11999999999' },
                        birthdate:    { type: 'string', format: 'date', example: '1995-05-20' },
                        address:      { type: 'string', example: 'Rua A, 123' },
                        role:         { type: 'string', enum: ['user', 'trainer', 'nutritionist', 'admin'] },
                        city:         { type: 'string', example: 'São Paulo' },
                        state:        { type: 'string', example: 'SP' }
                    }
                },
                Professional: {
                    type: 'object',
                    properties: {
                        _id:                  { type: 'string' },
                        userId:               { $ref: '#/components/schemas/User' },
                        type:                 { type: 'string', enum: ['Personal Trainer', 'Nutricionista'] },
                        status:               { type: 'string', enum: ['pending', 'approved', 'rejected'] },
                        bio:                  { type: 'string', example: 'Especialista em emagrecimento e hipertrofia.' },
                        city:                 { type: 'string', example: 'São Paulo' },
                        state:                { type: 'string', example: 'SP' },
                        pricePerHour:         { type: 'number', example: 120 },
                        professionalRegister: { type: 'string', example: 'CREF 12345-G/SP' },
                        weighted_rating:      { type: 'number', example: 4.7 },
                        total_ratings:        { type: 'number', example: 23 },
                        profile_views_7:      { type: 'number', example: 45 }
                    }
                },
                Plan: {
                    type: 'object',
                    properties: {
                        _id:            { type: 'string' },
                        title:          { type: 'string', example: 'Plano de Emagrecimento 8 Semanas' },
                        description:    { type: 'string' },
                        type:           { type: 'string', enum: ['training', 'meal'] },
                        items:          {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    name:     { type: 'string', example: 'Supino Reto' },
                                    detail:   { type: 'string', example: '4x12 repetições' },
                                    quantity: { type: 'string', example: '80' },
                                    unit:     { type: 'string', example: 'kg' }
                                }
                            }
                        },
                        startDate:      { type: 'string', format: 'date' },
                        endDate:        { type: 'string', format: 'date' },
                        clientId:       { type: 'string' },
                        professionalId: { type: 'string' }
                    }
                },
                Rating: {
                    type: 'object',
                    properties: {
                        _id:            { type: 'string' },
                        rating:         { type: 'integer', minimum: 1, maximum: 5, example: 5 },
                        comment:        { type: 'string', example: 'Excelente profissional!' },
                        userId:         { type: 'string' },
                        professionalId: { type: 'string' }
                    }
                },
                Training: {
                    type: 'object',
                    properties: {
                        _id:            { type: 'string' },
                        description:    { type: 'string', example: 'Treino de pernas' },
                        duration:       { type: 'integer', example: 60 },
                        date:           { type: 'string', format: 'date-time' },
                        userId:         { type: 'string' },
                        professionalId: { type: 'string' }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        error:   { type: 'string', example: 'Mensagem de erro.' },
                        details: { type: 'array', items: { type: 'string' } }
                    }
                }
            }
        },
        security: [{ bearerAuth: [] }],
        tags: [
            { name: 'Auth',          description: 'Registro e login' },
            { name: 'Usuários',      description: 'Gerenciamento de usuários' },
            { name: 'Profissionais', description: 'Perfis de Personal Trainers e Nutricionistas' },
            { name: 'Planos',        description: 'Planos de treino e alimentares' },
            { name: 'Treinos',       description: 'Registro de sessões de treino' },
            { name: 'Avaliações',    description: 'Avaliações de profissionais' },
            { name: 'Admin',         description: 'Painel administrativo (requer role admin)' }
        ]
    },
    apis: ['./src/routes/*.js'] // busca anotações @swagger nos arquivos de rota
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };
