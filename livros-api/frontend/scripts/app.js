const API = "/livros";
const lista = document.getElementById("lista");
const mensagem = document.getElementById("mensagem");

// Evita injeção de HTML (XSS) ao renderizar textos digitados pelo usuário
function escapar(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

// Busca os livros na API e renderiza na tela
async function carregar() {
  const resposta = await fetch(API);
  const livros = await resposta.json();

  lista.innerHTML = livros.map(l => `
    <li class="${l.lido ? "lido" : ""}">
      <input type="checkbox" ${l.lido ? "checked" : ""}
        onchange="alternarLido(${l.id}, this.checked)">
      <div class="info">
        <strong>${escapar(l.titulo)}</strong>
        <small>${escapar(l.autor)}, ${l.ano}</small>
      </div>
      <button class="excluir" onclick="excluir(${l.id})">Excluir</button>
    </li>
  `).join("");
}

// Atualiza apenas o status "lido" via PATCH
async function alternarLido(id, lido) {
  await fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lido })
  });
  carregar();
}

// Remove o livro via DELETE
async function excluir(id) {
  await fetch(`${API}/${id}`, { method: "DELETE" });
  carregar();
}

// Intercepta o envio do formulário para cadastrar via POST
document.getElementById("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const dados = {
    titulo: document.getElementById("titulo").value,
    autor: document.getElementById("autor").value,
    ano: parseInt(document.getElementById("ano").value)
  };

  const resposta = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados)
  });

  if (!resposta.ok) {
    const erro = await resposta.json();
    mensagem.textContent = erro.erro;
    return;
  }

  mensagem.textContent = "";
  e.target.reset();
  carregar();
});

// Carrega a lista inicial ao abrir a página
carregar();