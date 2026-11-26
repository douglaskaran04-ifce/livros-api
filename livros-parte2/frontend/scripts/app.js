// frontend/scripts/app.js
// URL completa da API: o front roda no Live Server (:5500) e a API em :3000
const API = 'http://localhost:3000';

const form = document.getElementById('form-livro');
const campoId = document.getElementById('livro-id');
const campoTitulo = document.getElementById('titulo');
const campoAno = document.getElementById('ano');
const campoAutor = document.getElementById('autor');
const tituloForm = document.getElementById('titulo-form');
const btnSalvar = document.getElementById('btn-salvar');
const btnCancelar = document.getElementById('btn-cancelar');
const filtroTitulo = document.getElementById('filtro-titulo');
const filtroAutor = document.getElementById('filtro-autor');
const lista = document.getElementById('lista');
const vazio = document.getElementById('vazio');
const mensagem = document.getElementById('mensagem');

// guarda a última lista recebida para consultar na hora de editar
let livros = [];
let timerMensagem;

function mostrarMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.className = `mensagem ${tipo}`;
  mensagem.hidden = false;
  clearTimeout(timerMensagem);
  timerMensagem = setTimeout(() => { mensagem.hidden = true; }, 4000);
}

// fetch que trata erros de rede e respostas da API
async function requisitar(caminho, opcoes) {
  let resposta;
  try {
    resposta = await fetch(API + caminho, opcoes);
  } catch (erro) {
    throw new Error('Não foi possível conectar à API. O servidor está rodando?');
  }

  if (resposta.status === 204) return null;

  const dados = await resposta.json();
  if (!resposta.ok) throw new Error(dados.erro || 'Erro desconhecido');
  return dados;
}

async function carregarAutores() {
  const autores = await requisitar('/autores');
  for (const a of autores) {
    campoAutor.add(new Option(a.nome, a.id));
    filtroAutor.add(new Option(a.nome, a.id));
  }
}

async function carregarLivros() {
  const params = new URLSearchParams();
  if (filtroTitulo.value.trim()) params.set('titulo', filtroTitulo.value.trim());
  if (filtroAutor.value) params.set('autor', filtroAutor.value);

  const consulta = params.toString();
  livros = await requisitar('/livros' + (consulta ? `?${consulta}` : ''));
  desenharLista();
}

function criarCelula(texto) {
  const td = document.createElement('td');
  td.textContent = texto;
  return td;
}

function criarBotao(texto, classe, aoClicar) {
  const botao = document.createElement('button');
  botao.type = 'button';
  botao.textContent = texto;
  botao.className = `pequeno ${classe}`;
  botao.addEventListener('click', aoClicar);
  return botao;
}

function desenharLista() {
  lista.replaceChildren();
  vazio.hidden = livros.length > 0;

  for (const l of livros) {
    const tr = document.createElement('tr');
    tr.append(
      criarCelula(l.id),
      criarCelula(l.titulo),
      criarCelula(l.ano),
      criarCelula(l.autor)
    );

    const acoes = document.createElement('td');
    acoes.className = 'acoes-celula';
    acoes.append(
      criarBotao('Editar', 'secundario', () => editar(l.id)),
      criarBotao('Excluir', 'perigo', () => excluir(l.id))
    );
    tr.append(acoes);
    lista.append(tr);
  }
}

function editar(id) {
  const livro = livros.find((l) => l.id === id);
  if (!livro) return;

  campoId.value = livro.id;
  campoTitulo.value = livro.titulo;
  campoAno.value = livro.ano;
  campoAutor.value = livro.autor_id;
  tituloForm.textContent = `Editando livro #${livro.id}`;
  btnSalvar.textContent = 'Salvar alterações';
  btnCancelar.hidden = false;
  campoTitulo.focus();
}

function limparFormulario() {
  form.reset();
  campoId.value = '';
  tituloForm.textContent = 'Novo livro';
  btnSalvar.textContent = 'Cadastrar';
  btnCancelar.hidden = true;
}

async function excluir(id) {
  const livro = livros.find((l) => l.id === id);
  if (!confirm(`Excluir "${livro.titulo}"?`)) return;

  try {
    await requisitar(`/livros/${id}`, { method: 'DELETE' });
    if (campoId.value === String(id)) limparFormulario();
    mostrarMensagem('Livro excluído.', 'sucesso');
    await carregarLivros();
  } catch (erro) {
    mostrarMensagem(erro.message, 'erro');
  }
}

form.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const corpo = {
    titulo: campoTitulo.value.trim(),
    ano: Number(campoAno.value),
    autor_id: Number(campoAutor.value)
  };

  const editando = campoId.value !== '';
  const caminho = editando ? `/livros/${campoId.value}` : '/livros';

  try {
    await requisitar(caminho, {
      method: editando ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(corpo)
    });
    mostrarMensagem(editando ? 'Livro atualizado.' : 'Livro cadastrado.', 'sucesso');
    limparFormulario();
    await carregarLivros();
  } catch (erro) {
    mostrarMensagem(erro.message, 'erro');
  }
});

btnCancelar.addEventListener('click', limparFormulario);
filtroTitulo.addEventListener('input', () => carregarLivros().catch((e) => mostrarMensagem(e.message, 'erro')));
filtroAutor.addEventListener('change', () => carregarLivros().catch((e) => mostrarMensagem(e.message, 'erro')));

async function iniciar() {
  try {
    await carregarAutores();
    await carregarLivros();
  } catch (erro) {
    mostrarMensagem(erro.message, 'erro');
  }
}

iniciar();
