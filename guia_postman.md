# 🚀 Guia de Testes da API EasyHealth (Postman)

Este documento foi criado para facilitar a sua apresentação e os testes do sistema utilizando o **Postman** (ou Insomnia). Siga as etapas na ordem abaixo para testar o fluxo completo da plataforma.

> ⚠️ **Dica Importante:** Defina a URL base como `http://localhost:3000` no seu Postman.

---

## Passo 1: Autenticação e Registro

Todos os próximos endpoints do sistema vão exigir um **Token JWT** para provar que você está logado. Por isso, a primeira coisa a se fazer é criar uma conta e logar.

### 1.1 Cadastrar Novo Usuário
Cria uma nova conta na base de dados (que depois pode virar um Profissional do app).
*   **Método:** `POST`
*   **Endpoint:** `/api/auth/register`
*   **Aba Body:** `raw` -> `JSON`
*   **Payload (Exemplo):**
```json
{
  "name": "João Apresentação",
  "email": "joao@email.com",
  "password": "senha_segura123",
  "cpf": "11122233344",
  "phone": "11999999999",
  "birthdate": "1995-10-10",
  "address": "Rua do Projeto, 123",
  "role": "trainer"
}
```

### 1.2 Fazer Login (Gerar o JWT)
Faz o login com a conta recém-criada para obtermos a chave do castelo.
*   **Método:** `POST`
*   **Endpoint:** `/api/auth/login`
*   **Aba Body:** `raw` -> `JSON`
*   **Payload:**
```json
{
  "email": "joao@email.com",
  "password": "senha_segura123"
}
```
> 🛑 **Atenção (Salve seu Token):** O Postman retonará no Response um `token` enorme. Copie este valor. Para todas as requisições abaixo, você deverá ir na **Aba Authorization do Postman**, selecionar **Bearer Token**, e colar esse token no campo correspondente! Copie também o `_id` do usuário retornado.

---

## Passo 2: Testando Usuários

### 2.1 Listar Todos os Usuários
Mostra que a restrição de segurança funciona. (Aba Authorization preenchida).
*   **Método:** `GET`
*   **Endpoint:** `/api/users`
*   *(Não precisa de Body)*

### 2.2 Buscar seu Próprio Usuário
*   **Método:** `GET`
*   **Endpoint:** `/api/users/COLE_O_ID_DO_USUÁRIO_AQUI`

---

## Passo 3: Profissionais

Você tem um Usuário cadastrado, agora vamos transformá-lo num Profissional apto a receber treinos e avaliações.

### 3.1 Promover Usuário a Profissional
Pega a conta do João e cria o Perfil de Trabalho dele.
*   **Método:** `POST`
*   **Endpoint:** `/api/professionals`
*   **Aba Body:** `raw` -> `JSON`
*   **Payload:**
```json
{
  "userId": "COLE_O_ID_DO_JOAO_AQUI",
  "type": "Personal Trainer"
}
```
> O sistema irá responder com o Perfil criado. Copie o `_id` deste novo Perfil Profissional para usarmos nos treinos e avaliações!

### 3.2 Listar por Especialidade
Mostra a busca funcionando.
*   **Método:** `GET`
*   **Endpoint:** `/api/professionals/type/Personal Trainer`

---

## Passo 4: Criando Conteúdo Relacional (Treinos e Avaliações)

### 4.1 Criar um Treinamento
Cria uma ficha de treino que um "Aluno" receberia do "Profissional".
*   **Método:** `POST`
*   **Endpoint:** `/api/trainings`
*   **Aba Body:** `raw` -> `JSON`
*   **Payload:**
```json
{
  "description": "Treino Hipertrofia A - Peito e Tríceps",
  "duration": 60,
  "date": "2026-03-01",
  "userId": "ID_DO_USUÁRIO_ALUNO",
  "professionalId": "ID_DO_PERFIL_PROFISSIONAL_DO_JOAO"
}
```

### 4.2 Listar Treinamentos Ativos
O sistema fará o *populate* automático e mostrará dados detalhados.
*   **Método:** `GET`
*   **Endpoint:** `/api/trainings`

### 4.3 Avaliar o Profissional (Rating)
Dar uma nota pro Personal Trainer João (A API irá recalcular imediatamente o ranking dele).
*   **Método:** `POST`
*   **Endpoint:** `/api/ratings`
*   **Aba Body:** `raw` -> `JSON`
*   **Payload:**
```json
{
    "rating": 5,
    "comment": "Melhor personal que eu já tive, treino super focado!",
    "userId": "ID_DE_UM_OUTRO_USUARIO_QUALQUER_ALUNO",
    "professionalId": "ID_DO_PERFIL_PROFISSIONAL_DO_JOAO"
}
```

### 4.4 Ver o Ranking dos Melhores do App
Para encerrar a apresentação com estilo, liste os melhores professores do aplicativo. O João deve aparecer com nota 5!
*   **Método:** `GET`
*   **Endpoint:** `/api/professionals/top-rated`

---
*Pronto! Seguindo estes passos em sequência no Postman, a apresentação de testes do sistema será impecável.*
