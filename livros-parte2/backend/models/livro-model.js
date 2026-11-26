// backend/models/livro-model.js
const db = require('../db');

const SELECT_COM_AUTOR = `
SELECT l.id, l.titulo, l.ano, l.autor_id, a.nome AS autor
FROM livros l
INNER JOIN autores a ON a.id = l.autor_id
`;

// filtros opcionais: ?autor=1&titulo=dom
function listar({ autor, titulo, ano_min } = {}) {
  let sql = SELECT_COM_AUTOR + ' WHERE 1=1';
  const params = [];

  if (autor) {
    sql += ' AND l.autor_id = ?';
    params.push(autor);
  }

  if (titulo) {
    sql += ' AND l.titulo LIKE ?';
    params.push(`%${titulo}%`);
  }

  if (ano_min) {
    sql += ' AND l.ano >= ?';
    params.push(ano_min);
  }

  sql += ' ORDER BY l.id';
  return db.prepare(sql).all(...params);
}

function buscarPorId(id) {
    return db.prepare(SELECT_COM_AUTOR + ' WHERE l.id = ?').get(id);
}

//Funções criadas: funções criar, atualizar e deletar
function criar({ titulo, ano, autor_id }) {
  const info = db
    .prepare('INSERT INTO livros (titulo, ano, autor_id) VALUES (?, ?, ?)')
    .run(titulo, ano, autor_id);

  return buscarPorId(info.lastInsertRowid);
}

function atualizar(id, { titulo, ano, autor_id }) {
  const info = db
    .prepare('UPDATE livros SET titulo = ?, ano = ?, autor_id = ? WHERE id = ?')
    .run(titulo, ano, autor_id, id);

  return info.changes > 0 ? buscarPorId(id) : null;
}

function deletar(id) {
  const info = db.prepare('DELETE FROM livros WHERE id = ?').run(id);
  return info.changes > 0;
}

module.exports = { listar, buscarPorId, criar, atualizar, deletar };

/*Para pensar: Por que WHERE 1=1 no começo do SQL?
Como 1=1 é sempre verdadeiro, a consulta funciona 
perfeitamente se nenhum filtro for enviado (retornando todos os livros). 
Além disso, ela permite concatenar qualquer filtro opcional usando 
diretamente AND ..., evitando ter que controlar 
se o primeiro filtro precisa de WHERE ou AND.*/