// backend/routes/livros-routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/livros-controller');

router.get('/', controller.listarLivros);
router.get('/:id', controller.buscarLivro);
router.post('/', controller.criarLivro);
router.put('/:id', controller.atualizarLivro);
router.delete('/:id', controller.deletarLivro);

module.exports = router;

/* 
Para pensar: Por que as rotas não repetem a palavra livros em nenhum caminho?

Porque o prefixo /livros já será montado centralmente no server.js através de 
app.use('/livros', livrosRoutes). Dentro do Router, todos os caminhos são 
relativos a esse prefixo (/ equivale a /livros e /:id equivale a /livros/:id), 
facilitando a manutenção caso o nome do endpoint precise mudar no futuro.
*/

