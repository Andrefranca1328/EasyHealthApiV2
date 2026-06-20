# EasyHealth API 🏋️‍♂️🥗

> *"Evolua quem evolui os outros."*

API RESTful completa que serve como backend para a plataforma **EasyHealth**, conectando **Personal Trainers** e **Nutricionistas** com seus clientes. Desenvolvido para o **Projeto Interdisciplinar IV** do Curso Superior de Tecnologia em **Desenvolvimento de Software Multiplataforma — FATEC Cotia**.

---

## 👥 Integrantes do Grupo (Colaboradores)

| Nome | RA |
|------|----|
| André L. D. França | [RA] |
| Daniel França | [RA] |
| Gustavo [Sobrenome] | [RA] |
| Giancarlo Sabatini | [RA] |

---

## 🌐 URLs Públicas da Aplicação

| Ambiente | URL |
|----------|-----|
| **Frontend — Produção (Vercel)** | [https://easy-health-one.vercel.app/](https://easy-health-one.vercel.app/) |
| **Backend — API (Render)** | [https://easyhealthapiv2.onrender.com](https://easyhealthapiv2.onrender.com) |
| **Documentação Interativa (Swagger)** | [https://easyhealthapiv2.onrender.com/api/docs](https://easyhealthapiv2.onrender.com/api/docs) |

---

## 📚 Documentação do Projeto

### Sobre o Sistema

O **EasyHealth** é uma plataforma de saúde e fitness com dois perfis de usuário:

- **Pacientes/Clientes (`role: user`)** — buscam profissionais por cidade/especialidade, agendam consultas e avaliam profissionais.
- **Profissionais de Saúde (`role: trainer | nutritionist`)** — gerenciam perfil, confirmam agendamentos, criam planos de treino e acompanham métricas de visitação.
- **Administradores (`role: admin`)** — aprovam/reprovam cadastros de profissionais e gerenciam roles.

### Arquitetura da API

```
Cliente HTTP (React/Postman)
        │
        ▼
 Express Router ── authMiddleware (JWT) ── adminMiddleware (role)
        │
        ▼
   Controller ── Service (regras de negócio)
        │
        ▼
  Mongoose ODM ── MongoDB Atlas
```

### Funcionalidades da API

| # | Módulo | Descrição |
|---|--------|-----------|
| 1 | Autenticação JWT | Registro, login com Bcrypt + JWT (1h de expiração) |
| 2 | Profissionais | Cadastro, busca com filtros dinâmicos, aprovação admin |
| 3 | Busca Avançada | `/search` com filtros de cidade, modalidade, preço e nota |
| 4 | Filtros Dinâmicos | `/filters` retorna listas de cidades e modalidades do banco de dados |
| 5 | Ranking Bayesiano | Ordenação ponderada por relevância estatística |
| 6 | Consultas | Agendamento, confirmação, cancelamento com multa de 30% (<24h) |
| 7 | Restrição Temporal | Bloqueio de reagendamentos com < 24h de antecedência |
| 8 | Planos de Treino | CRUD de planos de exercícios por profissional |
| 9 | Avaliações | Sistema de estrelas (1–5), 1 avaliação por par usuário/profissional |
| 10 | Métricas de Perfil | Log de visualizações (ProfileViewLog) com janela de 7 dias |
| 11 | Painel Admin | Aprovação/reprovação de profissionais e gestão de roles |
| 12 | Documentação Swagger | Interface interativa em `/api/docs` |

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Versão | Finalidade |
|-----------|--------|-----------|
| Node.js | 20.x | Runtime JavaScript no servidor |
| Express | 5.x | Framework HTTP |
| MongoDB Atlas | — | Banco de dados NoSQL em nuvem |
| Mongoose | 9.x | ODM para modelagem de dados |
| JWT (jsonwebtoken) | 9.x | Autenticação e autorização stateless |
| Bcrypt | 6.x | Hash seguro de senhas |
| Joi | 17.x | Validação de entrada em todos os endpoints |
| Multer | 2.x | Upload de arquivos (documentos PDF) |
| Swagger UI Express | 5.x | Documentação interativa da API |
| Jest | 29.x | Testes unitários (47 testes, 100% aprovados) |
| Nodemon | 3.x | Hot reload no ambiente de desenvolvimento |
| GitHub Actions | — | Pipeline de CI/CD automatizado |

---

## 📋 Índice

- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Como Rodar](#como-rodar)
- [Criar Admin](#criar-admin)
- [Testes](#testes)
- [Endpoints](#endpoints)
- [Deploy](#deploy)
- [Controle de Versão](#controle-de-versão)

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

```bash
npm run seed:admin
```

Configure `ADMIN_EMAIL`, `ADMIN_PASSWORD` e `ADMIN_NAME` no `.env` antes de executar.

---

## 🧪 Testes

```bash
# Rodar todos os testes com relatório de cobertura
npm test

# Saída verbose
npm test -- --verbose
```

**Status atual:** 47 testes unitários — **100% aprovados** ✅

**Cobertura:** Services e middlewares críticos — meta ≥ 80%

Suítes de teste:
- `tests/auth.unit.test.js` — Autenticação e registro
- `tests/professional.unit.test.js` — Serviços de profissionais
- `tests/rating.unit.test.js` — Sistema de avaliações
- `tests/training.unit.test.js` — Planos de treino
- `tests/user.unit.test.js` — Gestão de usuários
- `tests/middleware.unit.test.js` — Middlewares de segurança

---

## 📡 Endpoints

### 🔐 Auth — `/api/auth` (público)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/register` | Cadastro de usuário (paciente ou profissional) |
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
| GET | `/search` | Busca com filtros avançados (cidade, modalidade, preço, nota) |
| GET | `/filters` | Retorna listas dinâmicas de cidades e modalidades |
| GET | `/top-rated` | Top profissionais por nota bayesiana (`?limit=10`) |
| GET | `/:id` | Perfil completo |
| PUT | `/:id` | Atualiza perfil |
| DELETE | `/:id` | Remove |
| GET | `/:id/profile-views` | Incrementa e retorna views dos últimos 7 dias |

### 📅 Consultas — `/api/consultas` (requer JWT)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/` | Cria agendamento de consulta |
| GET | `/professional/:professionalId` | Consultas do profissional |
| GET | `/user/:userId` | Consultas do paciente |
| PATCH | `/:id/cancel` | Cancelamento (aplica multa 30% se < 24h) |
| PATCH | `/:id/confirm` | Confirmação de consulta pelo profissional |

### 📋 Planos — `/api/plans` (requer JWT)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/` | Cria plano (treino ou alimentar) |
| GET | `/my` | Planos do cliente logado |
| GET | `/created` | Planos criados por profissional |
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

## 🔄 Controle de Versão (Semantic Release)

O repositório segue a convenção de commits semânticos:

| Prefixo | Tipo |
|---------|------|
| `feat:` | Nova funcionalidade |
| `fix:` | Correção de bug |
| `chore:` | Manutenção geral |
| `docs:` | Atualização de documentação |
| `refactor:` | Refatoração sem mudança de comportamento |

---

## 📄 Licença

MIT © EasyHealth Team — FATEC Cotia 2025
