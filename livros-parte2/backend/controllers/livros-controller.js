// backend/controllers/livros-controller.js
const LivroModel = require('../models/livro-model');
const AutorModel = require('../models/autor-model');

function validar({ titulo, ano, autor_id }) {
  if (typeof titulo !== 'string' || titulo.trim() === '') {
    return 'Título é obrigatório';
  }
  if (!Number.isInteger(ano) || ano < 1000 || ano > new Date().getFullYear()) {
    return 'Ano deve ser um número inteiro válido';
  }
  if (!Number.isInteger(autor_id)) {
    return 'autor_id é obrigatório';
  }
  if (!AutorModel.buscarPorId(autor_id)) {
    return 'Autor inexistente';
  }
  return null;
}

function lerId(req) {
  const id = Number(req.params.id);
  return Number.isInteger(id) ? id : null;
}

function listarLivros(req, res) {
  res.json(LivroModel.listar(req.query));
}

function buscarLivro(req, res) {
  const id = lerId(req);
  if (id === null) return res.status(400).json({ erro: 'ID inválido' });

  const livro = LivroModel.buscarPorId(id);
  if (!livro) return res.status(404).json({ erro: 'Livro não encontrado' });

  res.json(livro);
}

function criarLivro(req, res) {
  const erro = validar(req.body);
  if (erro) return res.status(400).json({ erro });

  try {
    const livro = LivroModel.criar({
      titulo: req.body.titulo.trim(),
      ano: req.body.ano,
      autor_id: req.body.autor_id
    });
    res.status(201).location(`/livros/${livro.id}`).json(livro);
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ erro: 'Já existe um livro com esse título' });
    }
    throw err;
  }
}

function atualizarLivro(req, res) {
  const id = lerId(req);
  if (id === null) return res.status(400).json({ erro: 'ID inválido' });

  const erro = validar(req.body);
  if (erro) return res.status(400).json({ erro });

  try {
    const livro = LivroModel.atualizar(id, {
      titulo: req.body.titulo.trim(),
      ano: req.body.ano,
      autor_id: req.body.autor_id
    });

    if (!livro) return res.status(404).json({ erro: 'Livro não encontrado' });

    res.json(livro);
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ erro: 'Já existe um livro com esse título' });
    }
    throw err;
  }
}

function deletarLivro(req, res) {
  const id = lerId(req);
  if (id === null) return res.status(400).json({ erro: 'ID inválido' });

  const deletado = LivroModel.deletar(id);
  if (!deletado) return res.status(404).json({ erro: 'Livro não encontrado' });

  res.status(204).send();
}

module.exports = {
  listarLivros,
  buscarLivro,
  criarLivro,
  atualizarLivro,
  deletarLivro
};