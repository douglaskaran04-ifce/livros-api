// backend/db.js
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const DB_PATH = path.join(__dirname, 'data', 'livros.sqlite');
// o arquivo é criado sozinho, a pasta não
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.exec(`
CREATE TABLE IF NOT EXISTS autores (
id INTEGER PRIMARY KEY AUTOINCREMENT,
nome TEXT NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS livros (
id INTEGER PRIMARY KEY AUTOINCREMENT,
titulo TEXT NOT NULL UNIQUE COLLATE NOCASE,
ano INTEGER NOT NULL,
autor_id INTEGER NOT NULL,
FOREIGN KEY (autor_id) REFERENCES autores(id)
);
`);
// autores iniciais (só entram se ainda não existirem)
const inserirAutor = db.prepare('INSERT OR IGNORE INTO autores (nome) VALUES (?)');
for (const nome of [
'Machado de Assis',
'Clarice Lispector',
'Graciliano Ramos',
'Jorge Amado',
'Rachel de Queiroz'
]) {
inserirAutor.run(nome);
}
module.exports = db;