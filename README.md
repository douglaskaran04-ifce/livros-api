# 📚 Biblioteca Pessoal — API REST de Livros com SQLite, MVC e CORS (Parte 2)

API RESTful completa com operações **CRUD** (*Create, Read, Update, Delete*) desenvolvida em **Node.js** e **Express**, estruturada no padrão arquitetural **MVC** (*Models, Controllers, Routes*), com persistência relacional em **SQLite** (`better-sqlite3`) e comunicação entre origens distintas habilitada via **CORS** para consumo por uma interface web responsiva.

Projeto desenvolvido como atividade prática da disciplina de **Desenvolvimento Web 2** (Curso Técnico em Informática para Internet — IFCE Campus Maranguape).

---

## 🚀 Funcionalidades

- **Persistência relacional em SQLite:** Duas tabelas (`autores` e `livros`) conectadas por chave estrangeira (`FOREIGN KEY`) com integridade referencial ativa (`PRAGMA foreign_keys = ON`) e modo `WAL`.
- **Povoamento inicial (`Seed`):** Script automatizado (`npm run seed`) para popular o banco com 5 autores clássicos e 12 obras literárias sem duplicidade (`INSERT OR IGNORE`).
- **Listagem de livros com `INNER JOIN` e filtros dinâmicos:** Retorna o nome do autor junto aos dados do livro e suporta filtros combináveis por query string (`?autor=3&titulo=dom`).
- **Listagem de autores:** Endpoint dedicado (`GET /autores`) para carregar opções de seleção e validar relacionamentos.
- **Consulta individual (`GET /livros/:id`):** Busca de registro por `ID` com validação de parâmetro numérico (`400 Bad Request` para IDs inválidos e `404 Not Found` para registros inexistentes).
- **Cadastro (`POST /livros`) e Atualização (`PUT /livros/:id`):** Validação rigorosa de tipos no controller, verificação de existência do autor, tratamento de conflitos de título único (`409 Conflict`) e retorno do cabeçalho `Location` na criação (`201 Created`).
- **Exclusão de registros (`DELETE /livros/:id`):** Remoção persistente com retorno HTTP padronizado (`204 No Content`).
- **Front-end desacoplado com CORS:** Interface web servida separadamente via **Live Server** (porta `5500`) consumindo a API (porta `3000`) via **Fetch API**.

---

## 🛠️ Tecnologias Utilizadas

- **Back-end:** Node.js, Express (`express.Router`), `cors`
- **Banco de Dados:** SQLite com `better-sqlite3` (consultas parametrizadas com `?` contra *SQL Injection*)
- **Front-end:** HTML5, CSS3, JavaScript (ES6+, `fetch`, `async/await`)
- **Ferramentas de Desenvolvimento:** `nodemon`, Live Server (VS Code), Thunder Client

---

## 📁 Estrutura do Projeto

```text
livros-parte2/
├── backend/
│   ├── controllers/
│   │   ├── autores-controller.js  # Regras HTTP e respostas dos autores
│   │   └── livros-controller.js   # Validações, tratamento de erros e respostas HTTP dos livros
│   ├── data/
│   │   └── livros.sqlite          # Banco de dados SQLite (gerado automaticamente, ignorado no Git)
│   ├── models/
│   │   ├── autor-model.js         # Consultas SQL da tabela autores
│   │   └── livro-model.js         # Consultas SQL (JOIN, filtros e CRUD) da tabela livros
│   ├── routes/
│   │   ├── autores-routes.js      # Definição das rotas de /autores
│   │   └── livros-routes.js       # Definição das rotas de /livros
│   ├── .gitignore                 # Ignora node_modules/ e data/
│   ├── db.js                      # Conexão SQLite, PRAGMAs, DDL das tabelas e autores iniciais
│   ├── package.json               # Dependências e scripts (start, dev, seed)
│   ├── seed.js                    # Script para popular o banco com livros iniciais
│   └── server.js                  # Configuração do Express, CORS, middlewares e registro de routers
└── frontend/
    ├── index.html                 # Estrutura semântica da interface
    ├── scripts/
    │   └── app.js                 # Consumo da API (http://localhost:3000) via Fetch
    └── styles/
        └── styles.css             # Estilização da aplicação
```

---

## ⚙️ Instalação e Execução

### Pré-requisitos
- [Node.js](https://nodejs.org/) instalado (versão 18 ou superior recomendada).
- Extensão **Live Server** no VS Code para servir o front-end.

### Passo a passo

1. **Clone este repositório e acesse a pasta do back-end:**
   ```bash
   git clone https://github.com/seu-usuario/livros-parte2.git
   cd livros-parte2/backend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Popule o banco de dados com os registros iniciais:**
   ```bash
   npm run seed
   ```
   *(Este comando cria automaticamente a pasta `data/`, o arquivo `livros.sqlite`, os 5 autores e os 12 livros iniciais).*

4. **Inicie o servidor da API:**
   ```bash
   npm run dev
   ```
   *(Ou `npm start` para execução padrão sem nodemon).* A API estará disponível em [`http://localhost:3000`](http://localhost:3000).

5. **Inicie o front-end:**
   - Abra a pasta `livros-parte2` no VS Code.
   - Clique com o botão direito em `frontend/index.html` e selecione **Open with Live Server** (geralmente aberto em `http://127.0.0.1:5500` ou `http://localhost:5500`).

---

## 🔌 Documentação dos Endpoints

| Método | Rota | Descrição | Corpo da Requisição (JSON) | Status de Sucesso |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/autores` | Lista todos os autores ordenados por nome | — | `200 OK` |
| `GET` | `/livros` | Lista todos os livros com nome do autor (aceita `?autor=ID` e `?titulo=TEXTO`) | — | `200 OK` |
| `GET` | `/livros/:id` | Retorna um livro específico pelo `ID` | — | `200 OK` |
| `POST` | `/livros` | Cadastra um novo livro (retorna cabeçalho `Location`) | `{ "titulo", "ano", "autor_id" }` | `201 Created` |
| `PUT` | `/livros/:id` | Atualiza todos os dados de um livro existente | `{ "titulo", "ano", "autor_id" }` | `200 OK` |
| `DELETE` | `/livros/:id` | Remove um livro do banco de dados | — | `204 No Content` |

### Exemplos de Requisições (`curl` / Thunder Client)

#### Listar autores (`GET /autores`)
```bash
curl http://localhost:3000/autores
```

#### Filtrar livros por autor e título (`GET /livros?autor=2&titulo=hora`)
```bash
curl "http://localhost:3000/livros?autor=2&titulo=hora"
```

#### Cadastrar um livro (`POST /livros`)
```bash
curl -X POST http://localhost:3000/livros \
  -H "Content-Type: application/json" \
  -d '{"titulo": "Esaú e Jacó", "ano": 1904, "autor_id": 1}'
```

#### Atualizar um livro (`PUT /livros/13`)
```bash
curl -X PUT http://localhost:3000/livros/13 \
  -H "Content-Type: application/json" \
  -d '{"titulo": "Esaú e Jacó", "ano": 1904, "autor_id": 3}'
```

#### Excluir um livro (`DELETE /livros/13`)
```bash
curl -X DELETE http://localhost:3000/livros/13
```

---

## 🗺️ Roadmap do Projeto

- [x] **Parte 1:** API REST completa em memória + Front-end integrado com `fetch`.
- [x] **Parte 2:** Persistência relacional com **SQLite**, arquitetura **MVC**, rotas modulares com `express.Router` e comunicação via **CORS**.
- [ ] **Parte 3:** Autenticação e controle de acesso de usuários.

---

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais. Sinta-se à vontade para utilizá-lo como referência de estudos.
