# 📚 Biblioteca Pessoal — API REST de Livros com Express (Parte 1)

API RESTful completa com operações **CRUD** (*Create, Read, Update, Delete*) desenvolvida em **Node.js** e **Express**, acompanhada de uma interface web responsiva em tema escuro (*Dark Mode*) que consome os endpoints via **Fetch API**.

Projeto desenvolvido como atividade prática da disciplina de **Desenvolvimento Web 2** (Curso Técnico em Informática para Internet — IFCE Campus Maranguape).

---

## 🚀 Funcionalidades

- **Listagem de livros** com suporte a filtro opcional por status de leitura (`?lido=true` ou `?lido=false`).
- **Consulta individual** de livro por identificador numérico (`ID`).
- **Cadastro de novos livros** com geração automática de `ID` sequencial e validação rigorosa de tipos no back-end.
- **Atualização completa (`PUT`)** substituindo todos os atributos do registro.
- **Atualização parcial (`PATCH`)** permitindo alterar campos específicos (ex.: marcar/desmarcar livro como lido).
- **Exclusão de registros (`DELETE`)** com retorno HTTP padronizado (`204 No Content`).
- **Front-end integrado** servido estaticamente pelo próprio Express, com proteção contra injeção de HTML (*XSS*).

---

## 🛠️ Tecnologias Utilizadas

- **Back-end:** Node.js, Express
- **Front-end:** HTML5, CSS3 (Flexbox & Dark Mode), JavaScript (ES6+, `fetch`, `async/await`)
- **Persistência (Parte 1):** Armazenamento em memória (array JavaScript)

---

## 📁 Estrutura do Projeto

```text
livros-api/
├── backend/
│   └── server.js          # Servidor Express, middlewares, validações e rotas REST
├── frontend/
│   ├── index.html         # Estrutura semântica da interface
│   ├── scripts/
│   │   └── app.js         # Consumo da API via Fetch e manipulação do DOM
│   └── styles/
│       └── styles.css     # Estilização em tema escuro
├── package.json
└── package-lock.json
```

---

## ⚙️ Instalação e Execução

### Pré-requisitos
- [Node.js](https://nodejs.org/) instalado (versão 18 ou superior recomendada).

### Passo a passo

1. **Clone este repositório:**
   ```bash
   git clone https://github.com/seu-usuario/livros-api.git
   cd livros-api
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor:**
   ```bash
   node backend/server.js
   ```
   *(Opcional — modo desenvolvimento com reinicialização automática)*:
   ```bash
   npx nodemon backend/server.js
   ```

4. **Acesse a aplicação:**
   Abra o navegador em [`http://localhost:3000`](http://localhost:3000).

---

## 🔌 Documentação dos Endpoints

| Método | Rota | Descrição | Corpo da Requisição (JSON) | Status de Sucesso |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/livros` | Lista todos os livros (aceita `?lido=true` ou `?lido=false`) | — | `200 OK` |
| `GET` | `/livros/:id` | Retorna um livro específico pelo `ID` | — | `200 OK` |
| `POST` | `/livros` | Cadastra um novo livro | `{ "titulo", "autor", "ano", "lido"? }` | `201 Created` |
| `PUT` | `/livros/:id` | Substitui todos os dados de um livro existente | `{ "titulo", "autor", "ano", "lido"? }` | `200 OK` |
| `PATCH` | `/livros/:id` | Atualiza apenas os campos enviados | `{ "lido": true }` (exemplo) | `200 OK` |
| `DELETE` | `/livros/:id` | Remove um livro do acervo | — | `204 No Content` |

### Exemplos de Requisições (`curl` / Thunder Client)

#### Cadastrar um livro (`POST /livros`)
```bash
curl -X POST http://localhost:3000/livros \
  -H "Content-Type: application/json" \
  -d '{"titulo": "Vidas Secas", "autor": "Graciliano Ramos", "ano": 1938}'
```

#### Marcar livro como lido (`PATCH /livros/2`)
```bash
curl -X PATCH http://localhost:3000/livros/2 \
  -H "Content-Type: application/json" \
  -d '{"lido": true}'
```

#### Filtrar apenas livros lidos (`GET /livros?lido=true`)
```bash
curl http://localhost:3000/livros?lido=true
```

---

## 🗺️ Roadmap do Projeto

- [x] **Parte 1:** API REST completa em memória + Front-end integrado com `fetch`.
- [ ] **Parte 2:** Persistência de dados com banco **SQLite** e modularização de rotas com `express.Router`.
- [ ] **Parte 3:** Autenticação e controle de acesso de usuários.

---

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais. Sinta-se à vontade para utilizá-lo como referência de estudos.
