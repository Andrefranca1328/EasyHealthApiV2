# API EasyHealth

API RESTful para a plataforma EasyHealth desenvolvida em Node.js com Express e MongoDB. Este sistema gerencia usuários, profissionais da saúde (como personal trainers e fisioterapeutas), avaliações, visualizações de perfil e treinamentos.

---

## 🚀 Tecnologias e Bibliotecas Utilizadas
*   **Ambiente**: Node.js
*   **Framework de Rotas**: Express
*   **Banco de Dados**: MongoDB (com ODM Mongoose)
*   **Segurança & Autenticação**: JSON Web Tokens (jsonwebtoken), Bcrypt (Hashes), CORS
*   **Gerenciamento de Ambiente**: dotenv

## ⚙️ Como Executar o Projeto Localmente

1. **Pré-requisitos**:
   Certifique-se de ter o Docker (para subir o MongoDB localmente, caso opte por usar) e o Node.js instalados.

2. **Docker Compose** (Opcional, porém prático):
   Inicie o banco de dados executando o docker-compose nativo:
   ```bash
   docker-compose up -d
   ```

3. **Dependências**:
   Instale os pacotes npm rodando:
   ```bash
   npm install
   ```

4. **Variáveis de Ambiente**:
   Crie um arquivo `.env` na raiz do projeto com o seguinte modelo:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://127.0.0.1:27017/easyhealth
   JWT_SECRET=sua_chave_secreta_super_segura
   ```

5. **Iniciar a API**:
   Inicie o servidor local em modo de desenvolvimento com hot-reload:
   ```bash
   npm run dev
   ```
   *Você também pode usar `npm start` para rodar diretamente.*

---

## 🛠️ Funcionalidades e Funcionalidades (Endpoints)

A API é operada consumindo a base de rota `/api/...`.
**Proteção JWT**: A grande maioria dos Endpoints exige Token Bearer JWT (adquiridos na rota de `login`) no cabeçalho `Authorization`.

### 1. Autenticação (`/api/auth`)
- `POST /register`: Registra novos usuários de ambos os papéis (Pacientes vs Treinadores/Profissionais). Envia Email, Senha, CPF, Data Nascimento, etc.
- `POST /login`: Loga o usuário de volta, retornando o objeto contendo todos os dados e o Token Autorizatório JWT assinado.

### 2. Usuários (`/api/users`) - Requer JWT
- `GET /`: Traz todos os usuários cadastrados na plataforma.
- `GET /:id`: Busca os dados individuais de um usuário selecionado.
- `PUT /:id`: Atualiza dados do usuário (por exemplo, atualizar endereço ou papel).
- `DELETE /:id`: Remove a conta do usuário.

### 3. Profissionais da Saúde (`/api/professionals`) - Requer JWT
- `POST /`: Registra o usuário cadastrado previamente como um Profissional visível e apto a atuar no sistema (vinculando por `userId`).
- `GET /`: Lista todos os profissionais e incorpora o popular `populate` do mongoose para exibir seus dados base (Nome e informações do User nativo).
- `GET /:id`: Traz as informações totais de um único profissional focado.
- `PUT /:id`: Atualiza um profissional.
- `DELETE /:id`: Deleta um profissional focado.
- `GET /type/:type`: Endpoint exclusivo para filtar profissionais por tipo/especialidade específica (Ex: "Fisioterapeuta", "Nutricionista").
- `GET /top-rated`: Lista de profissionais rankeados pela sua avaliação com peso (weighted rating).
- `GET /:id/profile-views`: Coleta as interações das visualizações de perfil ocorridas nos últimos 7 dias daquele profissional para exibir de forma analítica.

### 4. Treinamentos (`/api/trainings`) - Requer JWT
*(Endpoints criadores ou gestores de fichas e treinamentos do banco Training)*
- Criar treinamentos (Rotinas propostas pelos treinadores).
- Leitura de todos ou por ID, atrelando perfeitamente Populates entre qual Usuário aluno está recebendo qual treinamento do determinado Profissional instrutor id.

### 5. Avaliações (`/api/ratings`) - Requer JWT
Rotas de *rating* que os alunos e usuários fornecem aos profissionais do sistema.
- A API conta com um cálculo de classificação ponderada que é efetuado através de algoritmos de conversão do Mongoose com pesos de base limitando as métricas, permitindo separar quem efetivamente lidera com credibilidade matemática.

---

> ℹ️ *Avisos Documentais*: Foi resolvido na v2 uma série de divergências estruturais baseadas em sistemas Windows que ocasionavam arquivos "não encontrados" em Dockers Linux e afins. Também existiu uma refatoração substituindo a conexão MySQL base por abstrações plenas de MongoDB escaláveis com `lean` parameters em consultas profundas. Para mais detalhes destas mudanças, analise o documento `walkthrough.md` importado na raiz.
