# EasyHealth API 🏋️‍♂️🥗

> *"Evolua quem evolui os outros."*

API RESTful completa que serve como backend para a plataforma **EasyHealth**, conectando **Personal Trainers** e **Nutricionistas** com seus clientes. Desenvolvido para o **Projeto Interdisciplinar IV** do Curso Superior de Tecnologia em **Desenvolvimento de Software Multiplataforma (FATEC Cotia)**.

---

## 👥 Integrantes do Grupo (Colaboradores)
*   **André L. D. França**
*   **Daniel França**
*   **Gustavo [Sobrenome]**
*   **Giancarlo Sabatini**

---

## 🌐 URLs Públicas da Aplicação
*   **URL do Frontend (Produção - Vercel):** [https://easy-health-one.vercel.app/](https://easy-health-one.vercel.app/)
*   **URL da API de Backend (Produção - Render):** [https://easyhealthapiv2.onrender.com](https://easyhealthapiv2.onrender.com)
*   **Documentação Interativa (Swagger):** [https://easyhealthapiv2.onrender.com/api/docs](https://easyhealthapiv2.onrender.com/api/docs)

---

## 📋 Índice

- [Funcionalidades](#funcionalidades)
- [Stack](#stack)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Como Rodar](#como-rodar)
- [Criar Admin](#criar-admin)
- [Testes](#testes)
- [Endpoints](#endpoints)
- [Deploy](#deploy)

---

## ✅ Funcionalidades

- **Autenticação JWT** — registro, login e proteção de rotas
- **Roles:** `user` (cliente), `trainer`, `nutritionist`, `admin`
- **Profissionais** — cadastro com upload de documento PDF, aprovação por admin
- **Listagem de Profissionais** — filtros por tipo, cidade e nota mínima
- **Ranking Bayesiano** — profissionais ordenados por nota ponderada
- **Planos de Treino** (Personal Trainer) e **Planos Alimentares** (Nutricionista)
- **Avaliações** — clientes avaliam profissionais (1–5 estrelas); 1 avaliação por par
- **Métricas de Perfil** — contador de visualizações dos últimos 7 dias
- **Painel Admin** — aprovação/reprovação de profissionais, gestão de roles
- **Documentação Swagger** em `/api/docs`
- **Validação de entrada** com Joi em todos os endpoints
- **Rate limiting** no login (20 req / 15 min)

---

## 🛠️ Stack

| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| Node.js | 20 | Runtime |
| Express | 5.x | Framework HTTP |
| MongoDB | Atlas | Banco de dados |
| Mongoose | 9.x | ODM |
| JWT | 9.x | Autenticação |
| Bcrypt | 6.x | Hash de senhas |
| Joi | 17.x | Validação de entrada |
| Multer | 2.x | Upload de arquivos |
| Swagger UI | 5.x | Documentação interativa |
| Jest | 29.x | Testes unitários |

---

## 📦 Pré-requisitos

- Node.js 18+
- npm 9+
- MongoDB Atlas (ou instância local)

---

## 🚀 Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/Andrefranca1328/EasyHealthApiV2.git
cd EasyHealthApiV2

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# edite o .env com suas credenciais
```

---

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env` na raiz com base no `.env.example`:

| Variável | Obrigatório | Descrição | Exemplo |
|----------|:-----------:|-----------|---------|
| `MONGO_URI` | ✅ | String de conexão MongoDB Atlas | `mongodb+srv://...` |
| `JWT_SECRET` | ✅ | Chave secreta JWT (mín. 32 chars) | `super_secret_key` |
| `JWT_EXPIRES_IN` | ❌ | Expiração do token | `1h` |
| `PORT` | ❌ | Porta do servidor | `3000` |
| `ALLOWED_ORIGINS` | ❌ | Origens CORS permitidas (vírgula) | `http://localhost:5173` |
| `ADMIN_EMAIL` | ✅* | E-mail do admin (seed) | `admin@easyhealth.com` |
| `ADMIN_PASSWORD` | ✅* | Senha do admin (seed) | `senha_forte` |
| `ADMIN_NAME` | ❌ | Nome do admin | `Admin EasyHealth` |
| `API_BASE_URL` | ❌ | URL base (Swagger em produção) | `https://api.onrender.com` |

> *Obrigatório apenas para o comando `npm run seed:admin`

---

## ▶️ Como Rodar

```bash
# Desenvolvimento (hot reload)
npm run dev

# Produção
npm start
```

A API estará disponível em `http://localhost:3000`  
Documentação Swagger: `http://localhost:3000/api/docs`

---

## 👤 Criar Admin

O primeiro usuário administrador é criado via script. Configure `ADMIN_EMAIL`, `ADMIN_PASSWORD` e `ADMIN_NAME` no `.env` e execute:

```bash
npm run seed:admin
```

Após isso, faça login com essas credenciais e use o token obtido nas rotas `/api/admin/*`.

---

## 🧪 Testes

```bash
# Rodar todos os testes com relatório de cobertura
npm test

# Saída verbose
npm test -- --verbose
```

**Cobertura:** Services e middlewares — meta ≥ 80%

---

## 📡 Endpoints

### 🔐 Auth — `/api/auth` (público)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/register` | Cadastro de usuário |
| POST | `/login` | Login → retorna JWT |

### 👤 Usuários — `/api/users` (requer JWT)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/` | Lista todos os usuários |
| GET | `/:id` | Busca usuário por ID |
| PUT | `/:id` | Atualiza usuário |
| DELETE | `/:id` | Remove usuário |

### 🏋️ Profissionais — `/api/professionals` (requer JWT)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/` | Lista aprovados (`?type=&city=&minRating=`) |
| POST | `/` | Cadastra profissional (multipart/form-data + PDF) |
| GET | `/:id` | Perfil completo |
| PUT | `/:id` | Atualiza perfil |
| DELETE | `/:id` | Remove |
| GET | `/top-rated` | Top profissionais por nota (`?limit=10`) |
| GET | `/type/:type` | Filtra por tipo |
| GET | `/:id/profile-views` | Incrementa e retorna views |

### 📋 Planos — `/api/plans` (requer JWT)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/` | Cria plano (treino ou alimentar) |
| GET | `/my` | Planos do cliente logado (`?type=training\|meal`) |
| GET | `/created` | Planos criados por um profissional |
| GET | `/:id` | Detalhe do plano |
| PUT | `/:id` | Atualiza plano |
| DELETE | `/:id` | Remove plano |

### 🏃 Treinos — `/api/trainings` (requer JWT)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/` | Registra sessão de treino |
| GET | `/` | Lista treinos (`?userId=&professionalId=`) |
| GET | `/:id` | Detalhe |
| PUT | `/:id` | Atualiza |
| DELETE | `/:id` | Remove |

### ⭐ Avaliações — `/api/ratings` (requer JWT)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/` | Avalia um profissional (1–5 estrelas) |
| GET | `/:professionalId` | Lista avaliações de um profissional |

### 🔑 Admin — `/api/admin` (requer JWT + role admin)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/professionals` | Todos os profissionais |
| GET | `/professionals/pending` | Aguardando aprovação |
| PATCH | `/professionals/:id/status` | Aprova ou reprova |
| PATCH | `/users/:id/role` | Atualiza role de usuário |

---

## ☁️ Deploy

### Render (recomendado)

1. Faça push para o GitHub (repositório público)
2. Acesse [render.com](https://render.com) → New Web Service → conecte o repositório
3. Configure as variáveis de ambiente no painel
4. Deploy automático a cada push na `main`

### Docker

```bash
docker build -t easyhealth-api .
docker run -p 3000:3000 --env-file .env easyhealth-api
```

---

## 📄 Licença

MIT © EasyHealth Team
