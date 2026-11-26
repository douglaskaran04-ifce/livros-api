// backend/models/autor-model.js
const db = require('../db');

function listarTodos() {
    return db.prepare('SELECT * FROM autores ORDER BY nome').all();
}

function buscarPorId(id) {
    return db.prepare('SELECT * FROM autores WHERE id = ?').get(id);
}

module.exports = { listarTodos, buscarPorId };