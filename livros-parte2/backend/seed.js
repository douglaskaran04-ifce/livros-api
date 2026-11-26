// backend/seed.js
// Popula o banco com livros de exemplo. Rode uma vez: node seed.js
const db = require('./db');

const livros = [
['Dom Casmurro', 1899, 'Machado de Assis'],
['Memórias Póstumas de Brás Cubas', 1881, 'Machado de Assis'],
['Quincas Borba', 1891, 'Machado de Assis'],
['A Hora da Estrela', 1977, 'Clarice Lispector'],
['Perto do Coração Selvagem', 1943, 'Clarice Lispector'],
['Laços de Família', 1960, 'Clarice Lispector'],
['Vidas Secas', 1938, 'Graciliano Ramos'],
['São Bernardo', 1934, 'Graciliano Ramos'],
['Capitães da Areia', 1937, 'Jorge Amado'],
['Gabriela, Cravo e Canela', 1958, 'Jorge Amado'],
['O Quinze', 1930, 'Rachel de Queiroz'],
['As Três Marias', 1939, 'Rachel de Queiroz']
];

const buscarAutor = db.prepare('SELECT id FROM autores WHERE nome = ?');
const inserir = db.prepare(
'INSERT OR IGNORE INTO livros (titulo, ano, autor_id) VALUES (?, ?, ?)'
);

let inseridos = 0;
for (const [titulo, ano, autor] of livros) {
    const { id } = buscarAutor.get(autor);
    inseridos += inserir.run(titulo, ano, id).changes;
}

console.log(`${inseridos} livros inseridos (${livros.length - inseridos} já existiam).`);