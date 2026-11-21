const express = require("express");
const path = require("path");

const app = express();

// Middlewares para interpretar JSON no corpo das requisições e servir o front-end
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

// "Banco de dados" em memória
let livros = [
  { id: 1, titulo: "Dom Casmurro", autor: "Machado de Assis", ano: 1899, lido: true },
  { id: 2, titulo: "Capitães da Areia", autor: "Jorge Amado", ano: 1937, lido: false },
  { id: 3, titulo: "O Cortiço", autor: "Aluísio Azevedo", ano: 1890, lido: false }
];

let proximoId = 4;

// Função de validação dos dados recebidos (parcial = true permite campos omitidos no PATCH)
function validar(dados, parcial = false) {
  const { titulo, autor, ano, lido } = dados;

  if (!parcial || titulo !== undefined) {
    if (typeof titulo !== "string" || titulo.trim() === "") {
      return "O título é obrigatório e deve ser um texto";
    }
  }

  if (!parcial || autor !== undefined) {
    if (typeof autor !== "string" || autor.trim() === "") {
      return "O autor é obrigatório e deve ser um texto";
    }
  }

  if (!parcial || ano !== undefined) {
    if (!Number.isInteger(ano) || ano < 1) {
      return "O ano é obrigatório e deve ser um número inteiro";
    }
  }

  if (lido !== undefined && typeof lido !== "boolean") {
    return "O campo lido deve ser true ou false";
  }

  return null;
}

// 1. Listar todos os livros (com filtro opcional ?lido=true ou ?lido=false)
app.get("/livros", (req, res) => {
  let resultado = livros;

  if (req.query.lido !== undefined) {
    resultado = resultado.filter(l => String(l.lido) === req.query.lido);
  }

  res.json(resultado);
});

// 2. Buscar um livro específico pelo ID
app.get("/livros/:id", (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ erro: "O id deve ser um número" });
  }

  const livro = livros.find(l => l.id === id);

  if (!livro) {
    return res.status(404).json({ erro: "Livro não encontrado" });
  }

  res.json(livro);
});

// 3. Cadastrar um novo livro
app.post("/livros", (req, res) => {
  const erro = validar(req.body);

  if (erro) {
    return res.status(400).json({ erro });
  }

  const { titulo, autor, ano, lido = false } = req.body;

  const novo = {
    id: proximoId++,
    titulo: titulo.trim(),
    autor: autor.trim(),
    ano,
    lido
  };

  livros.push(novo);
  res.status(201).location(`/livros/${novo.id}`).json(novo);
});

// 4. Substituir um livro inteiro (PUT)
app.put("/livros/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const indice = livros.findIndex(l => l.id === id);

  if (indice === -1) {
    return res.status(404).json({ erro: "Livro não encontrado" });
  }

  const erro = validar(req.body);

  if (erro) {
    return res.status(400).json({ erro });
  }

  const { titulo, autor, ano, lido = false } = req.body;

  livros[indice] = {
    id,
    titulo: titulo.trim(),
    autor: autor.trim(),
    ano,
    lido
  };

  res.json(livros[indice]);
});

// 5. Atualizar parcialmente um livro (PATCH)
app.patch("/livros/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const livro = livros.find(l => l.id === id);

  if (!livro) {
    return res.status(404).json({ erro: "Livro não encontrado" });
  }

  const erro = validar(req.body, true);

  if (erro) {
    return res.status(400).json({ erro });
  }

  const { titulo, autor, ano, lido } = req.body;

  if (titulo !== undefined) livro.titulo = titulo.trim();
  if (autor !== undefined) livro.autor = autor.trim();
  if (ano !== undefined) livro.ano = ano;
  if (lido !== undefined) livro.lido = lido;

  res.json(livro);
});

// 6. Excluir um livro (DELETE)
app.delete("/livros/:id", (req, res) => {
  const id = parseInt(req.params.id);

  if (!livros.some(l => l.id === id)) {
    return res.status(404).json({ erro: "Livro não encontrado" });
  }

  livros = livros.filter(l => l.id !== id);
  res.status(204).send();
});

// Inicialização do servidor
app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});