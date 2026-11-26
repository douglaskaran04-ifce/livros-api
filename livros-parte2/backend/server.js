// backend/server.js
const express = require('express');
const cors = require('cors'); // Adicionado no Passo 9
const livrosRoutes = require('./routes/livros-routes');
const autoresRoutes = require('./routes/autores-routes');

const app = express();
const PORT = 3000;

app.use(cors()); // Adicionado no Passo 9 (antes do express.json())
app.use(express.json());

app.use('/livros', livrosRoutes);
app.use('/autores', autoresRoutes);

// rota não encontrada
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

// qualquer erro inesperado cai aqui (e não derruba o servidor)
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ erro: 'JSON inválido no corpo da requisição' });
  }
  console.error(err);
  res.status(500).json({ erro: 'Erro interno do servidor' });
});

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});

/*
Passos 8, 10 e 11: Respostas às perguntas de verificação
Passo 8 — Para pensar (Erro de CORS):

O servidor recebeu o pedido? Sim, o servidor recebe a requisição HTTP GET 
e devolve os dados, enquanto o Thunder Client continua funcionando normalmente 
por não aplicar políticas de navegador.

Quais são as duas origens envolvidas? A origem do front end 
(http://localhost:5500 ou [http://127.0.0.1:5500](http://127.0.0.1:5500)) e a 
origem da API (http://localhost:3000). Elas diferem na porta (5500 vs. 3000), caracterizando Cross-Origin.

Quem está bloqueando: o servidor ou o navegador? O navegador. Como medida de segurança 
(Same-Origin Policy), o navegador bloqueia a leitura da resposta pelo JavaScript do frontend 
porque o servidor não enviou o cabeçalho Access-Control-Allow-Origin autorizando aquela origem.

Passo 10 — O banco guarda os dados:

O livro cadastrado ainda está lá? Sim. Diferente da Parte 1 (onde os dados ficavam em 
um array na memória RAM e eram apagados ao encerrar o processo do Node.js), agora os 
registros são persistidos em disco no arquivo backend/data/livros.sqlite.

Passo 11 — Para pensar (Chave estrangeira em ação):

Por que vale ter as duas proteções (controller e banco)? 
A validação no controller garante uma boa experiência de uso, 
retornando um status semântico (400 Bad Request) e uma mensagem 
clara em português ("Autor inexistente"). Já a restrição no banco de 
dados (FOREIGN KEY com foreign_keys = ON) atua como a última barreira de 
integridade: se outra rota, script ou desenvolvedor tentar inserir dados inválidos 
diretamente no banco, a consistência relacional continua protegida.
*/