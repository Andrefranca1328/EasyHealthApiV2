# 📋 Especificações do Projeto — EasyHealth API (Backend)

> **Nova Identidade:** Plataforma exclusiva para **Personal Trainers** e **Nutricionistas**.
> Cor primária: `#9d11d9` (roxo elétrico). Consulte `IDENTIDADE.md` para o documento completo.

## 1. Visão Geral

**Nome do Projeto:** EasyHealth API
**Público-Alvo:** Personal Trainers e Nutricionistas (e seus clientes)
**Versão:** 2.0.0
**Tipo:** REST API
**Framework:** Express.js (v5)
**Banco de Dados:** MongoDB (via Mongoose v9)
**Autenticação:** JWT (JSON Web Tokens) + Bcrypt
**Linguagem:** JavaScript (Node.js)
**Porta Padrão:** `3000`


---

## 2. Stack Tecnológica

| Dependência       | Versão    | Finalidade                              |
|-------------------|-----------|-----------------------------------------|
| express           | ^5.1.0    | Framework HTTP                          |
| mongoose          | ^9.0.0    | ORM para MongoDB                        |
| bcrypt            | ^6.0.0    | Hash de senhas                          |
| jsonwebtoken      | ^9.0.2    | Geração e validação de tokens JWT       |
| dotenv            | ^17.2.3   | Variáveis de ambiente                   |
| cors              | ^2.8.5    | Suporte a Cross-Origin Resource Sharing |
| multer            | ^2.1.0    | Upload de arquivos (documentos)         |
| nodemon *(dev)*   | ^3.1.10   | Hot reload para desenvolvimento         |

---

## 3. Variáveis de Ambiente `.env`

| Variável        | Descrição                                 |
|-----------------|-------------------------------------------|
| `MONGO_URI`     | String de conexão com o MongoDB Atlas     |
| `JWT_SECRET`    | Chave secreta para assinar tokens JWT     |
| `JWT_EXPIRES_IN`| Expiração do token (padrão: `1h`)         |
| `PORT`          | Porta do servidor (padrão: `3000`)        |

---

## 4. Arquitetura do Projeto

```
EasyHealthApiV2/
├── src/
│   ├── app.js                  # Entry point — configuração do Express e rotas
│   ├── config/
│   │   └── db.js               # Conexão com MongoDB via Mongoose
│   ├── models/
│   │   ├── user.js             # Schema do usuário
│   │   ├── professional.js     # Schema do profissional
│   │   ├── Training.js         # Schema de treino
│   │   ├── Rating.js           # Schema de avaliação
│   │   └── ProfileViewLog.js   # Schema de log de visualização de perfil
│   ├── controllers/
│   │   ├── AuthController.js
│   │   ├── UserController.js
│   │   ├── professionalController.js
│   │   ├── TrainingController.js
│   │   └── RatingController.js
│   ├── services/
│   │   ├── AuthService.js
│   │   ├── UserService.js
│   │   ├── ProfessionalService.js
│   │   ├── TrainingService.js
│   │   └── RatingService.js
│   ├── routes/
│   │   ├── AuthRoutes.js
│   │   ├── UserRoutes.js
│   │   ├── ProfessionalRoutes.js
│   │   ├── TrainingRoutes.js
│   │   └── RatingRoutes.js
│   └── middlewares/
│       ├── authMiddleware.js   # Validação do token JWT
│       └── uploadMiddleware.js # Middleware Multer para upload
├── tests/
├── docs/
├── package.json
└── .gitignore
```

---

## 5. Modelos de Dados (MongoDB Schemas)

### 5.1 User
| Campo       | Tipo   | Obrigatório | Restrições              |
|-------------|--------|-------------|-------------------------|
| name        | String | Sim         | —                       |
| email       | String | Sim         | Único                   |
| password    | String | Sim         | Hash via bcrypt         |
| cpf         | String | Sim         | Único                   |
| phone       | String | Sim         | —                       |
| birthdate   | Date   | Sim         | —                       |
| address     | String | Sim         | —                       |
| role        | String | Sim         | `user` \| `trainer`     |

### 5.2 Professional
| Campo            | Tipo       | Padrão          | Descrição                            |
|------------------|------------|-----------------|--------------------------------------|
| userId           | ObjectId   | —               | Referência ao User                   |
| type             | String     | Personal Trainer | Tipo/especialidade do profissional  |
| status           | String     | `pending`       | `pending` \| `approved` \| `rejected`|
| document         | String     | —               | Documento de habilitação             |
| weighted_rating  | Number     | 0.0             | Nota média ponderada                 |
| total_ratings    | Number     | 0               | Total de avaliações recebidas        |
| profile_views_7  | Number     | 0               | Visualizações nos últimos 7 dias     |

### 5.3 Training
| Campo          | Tipo     | Obrigatório | Descrição            |
|----------------|----------|-------------|----------------------|
| description    | String   | Sim         | Descrição do treino  |
| duration       | Number   | Sim         | Duração (minutos)    |
| date           | Date     | Sim         | Data do treino       |
| userId         | ObjectId | Sim         | Referência ao User   |
| professionalId | ObjectId | Sim         | Referência ao Professional |

### 5.4 Rating
| Campo          | Tipo     | Restrições               | Descrição                  |
|----------------|----------|--------------------------|----------------------------|
| rating         | Number   | min: 1, max: 5           | Nota dada pelo usuário     |
| comment        | String   | Opcional                 | Comentário                 |
| userId         | ObjectId | —                        | Referência ao User         |
| professionalId | ObjectId | —                        | Referência ao Professional |
| *índice único* | —        | `userId + professionalId`| 1 avaliação por par        |

### 5.5 ProfileViewLog
| Campo          | Tipo     | Descrição                             |
|----------------|----------|---------------------------------------|
| professionalId | ObjectId | Referência ao Professional            |
| viewed_at      | Date     | Data/hora da visualização (padrão: now)|

---

## 6. Endpoints da API

### 6.1 Autenticação — `/api/auth` *(Público)*

| Método | Rota        | Descrição                        |
|--------|-------------|----------------------------------|
| POST   | `/register` | Cadastro de novo usuário         |
| POST   | `/login`    | Login — retorna JWT + dados user |

**Exemplo de Registro:**
```json
POST /api/auth/register
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123",
  "cpf": "000.000.000-00",
  "phone": "11999999999",
  "birthdate": "1995-05-20",
  "address": "Rua A, 123",
  "role": "user"
}
```

**Resposta de Login:**
```json
{
  "user": { "name": "João Silva", "email": "joao@email.com", "role": "user", ... },
  "token": "<JWT>"
}
```

---

### 6.2 Usuários — `/api/users` *(Requer JWT)*

| Método | Rota    | Descrição                     |
|--------|---------|-------------------------------|
| GET    | `/`     | Lista todos os usuários       |
| GET    | `/:id`  | Busca usuário por ID          |
| PUT    | `/:id`  | Atualiza usuário              |
| DELETE | `/:id`  | Remove usuário                |

---

### 6.3 Profissionais — `/api/professionals` *(Requer JWT)*

| Método | Rota                       | Descrição                                      |
|--------|----------------------------|------------------------------------------------|
| POST   | `/`                        | Cadastra novo profissional                     |
| GET    | `/:id`                     | Busca profissional por ID (populate User)      |
| PUT    | `/:id`                     | Atualiza dados do profissional                 |
| DELETE | `/:id`                     | Remove profissional                            |
| GET    | `/top-rated`               | Lista top profissionais por nota               |
| GET    | `/type/:type`              | Filtra por tipo/especialidade                  |
| GET    | `/:id/profile-views`       | Incrementa e retorna views dos últimos 7 dias  |

---

### 6.4 Treinos — `/api/trainings` *(Requer JWT)*

| Método | Rota    | Descrição               |
|--------|---------|-------------------------|
| POST   | `/`     | Cria novo treino        |
| GET    | `/`     | Lista todos os treinos  |
| GET    | `/:id`  | Busca treino por ID     |
| PUT    | `/:id`  | Atualiza treino         |
| DELETE | `/:id`  | Remove treino           |

---

### 6.5 Avaliações — `/api/ratings` *(Requer JWT)*

| Método | Rota                   | Descrição                             |
|--------|------------------------|---------------------------------------|
| POST   | `/`                    | Cria avaliação para um profissional   |
| GET    | `/:professionalId`     | Lista avaliações de um profissional   |

---

## 7. Autenticação e Segurança

- Todas as rotas (exceto `/api/auth`) são protegidas pelo middleware `authMiddleware`.
- O middleware extrai e valida o token JWT do header `Authorization: Bearer <token>`.
- O payload do token contém: `{ id, email, role }`.
- Senhas são armazenadas com hash bcrypt (salt rounds: 10).
- Um usuário só pode avaliar um profissional uma vez (índice composto único).

---

## 8. Métricas de Perfil

O campo `profile_views_7` no modelo `Professional` rastreia visualizações de perfil. Cada chamada ao endpoint `GET /:id/profile-views` incrementa o contador em 1. O modelo `ProfileViewLog` foi preparado para logs detalhados de visualizações com carimbo de data/hora.

---

## 9. Scripts de Execução

```bash
# Instalar dependências
npm install

# Desenvolvimento com hot reload
npm run dev

# Produção
npm start
```

---

## 10. Fluxo de Cadastro de Profissional

1. Usuário se registra via `POST /api/auth/register` com `role: "trainer"`.
2. Sistema cria o `User` no banco de dados.
3. Após login, o profissional envia `POST /api/professionals` com seu documento.
4. O registro de profissional fica com `status: "pending"` até aprovação.
5. Após aprovação (`status: "approved"`), aparece nos resultados públicos.
