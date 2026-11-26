// backend/routes/autores-routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/autores-controller');

router.get('/', controller.listarAutores);
router.get('/:id/livros', controller.listarLivrosDoAutor);

module.exports = router;