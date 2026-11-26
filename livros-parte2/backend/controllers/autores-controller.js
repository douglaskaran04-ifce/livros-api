// backend/controllers/autores-controller.js

const AutorModel = require('../models/autor-model');
const LivroModel = require('../models/livro-model');

function listarAutores(req, res) {
  res.json(AutorModel.listarTodos());
}

function listarLivrosDoAutor(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ erro: 'ID inválido' });
  }

  const autor = AutorModel.buscarPorId(id);
  if (!autor) {
    return res.status(404).json({ erro: 'Autor não encontrado' });
  }

  const livros = LivroModel.listar({ autor: id });
  res.json(livros);
}

module.exports = { listarAutores, listarLivrosDoAutor };