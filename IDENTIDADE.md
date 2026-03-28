# EasyHealth — Documento de Nova Identidade

## 1. Posicionamento

**O que é:** Plataforma digital exclusiva para **Personal Trainers** e **Nutricionistas** gerenciarem seus clientes, sessões e planos alimentares.

**Para quem:** Profissionais certificados da área de fitness, musculação e nutrição esportiva.

**Como:** Conexão direta entre profissionais e clientes, com gestão de agendamentos, avaliações e métricas de performance.

**Slogan sugerido:** *"Evolua quem evolui os outros."*

---

## 2. Paleta de Cores

| Token              | HEX / Valor                | Uso                               |
|--------------------|----------------------------|-----------------------------------|
| `--primary`        | `#9d11d9`                  | Cor primária — roxo elétrico      |
| `--primary-hover`  | `#7d0db0`                  | Hover de botões                   |
| `--primary-light`  | `#c158f0`                  | Glows e destaques                 |
| `--primary-alpha`  | `rgba(157, 17, 217, 0.15)` | Fundos de badges e hover          |
| `--bg-dark`        | `#0e0e14`                  | Fundo geral (quase preto)         |
| `--bg-surface`     | `#16161f`                  | Cards e painéis                   |
| `--bg-elevated`    | `#1e1e2e`                  | Cards secundários                 |
| `--border`         | `#2a2a3d`                  | Bordas e separadores              |
| `--text-primary`   | `#f0f0ff`                  | Texto principal                   |
| `--text-secondary` | `#8888aa`                  | Labels, subtítulos                |
| `--success`        | `#22c55e`                  | Aprovado / positivo               |
| `--warning`        | `#f59e0b`                  | Pendente / atenção                |
| `--error`          | `#ef4444`                  | Erro / reprovado                  |

---

## 3. Tipografia

| Família   | Pesos         | Uso                      |
|-----------|---------------|--------------------------|
| **Barlow** | 700, 800      | Títulos e headings       |
| **Inter**  | 400, 500, 600 | Corpo, labels, botões    |

Fonte Google Fonts: `https://fonts.googleapis.com/css2?family=Barlow:wght@700;800&family=Inter:wght@400;500;600&display=swap`

---

## 4. Tom de Voz

- **Direto e motivador** — linguagem de academia, sem rodeios
- **Cuidado e precisão** — referência à nutrição e saúde baseada em evidências
- **Tecnologia a serviço do corpo** — sensação de app premium, moderno

---

## 5. Perfis Suportados

| Papel        | Acesso                              |
|--------------|-------------------------------------|
| **Trainer**  | Painel de clientes, sessões, métricas de perfil, avaliações recebidas |
| **Cliente**  | Agendamentos, perfil, planos de treino/nutrição |

> Apenas Personal Trainers e Nutricionistas podem se cadastrar como profissionais. Usuários comuns são os clientes desses profissionais.

---

## 6. Endpoints da API Alinhados à Nova Identidade

| Contexto         | Endpoint                            | Papel               |
|------------------|-------------------------------------|---------------------|
| Cadastro/Login   | `POST /api/auth/register|login`     | Todos               |
| Perfil cliente   | `GET|PUT /api/users/:id`            | Cliente autenticado |
| Profissional     | `GET|POST|PUT /api/professionals`   | Trainer autenticado |
| Sessões/Treinos  | `CRUD /api/trainings`               | Trainer + Cliente   |
| Avaliações       | `POST|GET /api/ratings`             | Cliente → Trainer   |
| Views de Perfil  | `GET /api/professionals/:id/profile-views` | Público / Autenticado |
