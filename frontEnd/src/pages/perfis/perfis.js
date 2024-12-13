document.addEventListener("DOMContentLoaded", () => {
  const tabelaPerfis = document.getElementById("tabela-perfis");
  const searchInput = document.getElementById("search");
  const rowsPerPageSelect = document.getElementById("rows-per-page");
  const paginationContainer = document.querySelector(".pagination");

  let perfis = [];
  let paginaAtual = 1;
  let rowsPerPage = 5;

  function getToken() {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1];
  }

  function formatarDataHora(dataISO) {
    const data = new Date(dataISO);
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  function renderizarTabela(perfisFiltrados) {
    tabelaPerfis.innerHTML = "";

    const inicio = (paginaAtual - 1) * rowsPerPage;
    const fim = inicio + rowsPerPage;

    const perfisPaginados = perfisFiltrados.slice(inicio, fim);
    const token = getToken();
    const podeEditarPerfis = verificarPermissao(token, "Perfis", "Edição");

    perfisPaginados.forEach((perfil) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${perfil.nome}</td>
        <td>${formatarDataHora(perfil.created_at)}</td>
        <td>
        ${
          podeEditarPerfis
            ? `<button class="edit-btn" onclick="carregarPerfilParaEdicao('${perfil.id_perfil}')">✏️</button>
          <button class="delete-btn" onclick="deletarPerfil('${perfil.id_perfil}')">🗑️</button>`
            : ""
        }          
          <button class="details-btn" onclick="abrirModalDetalhar('${
            perfil.id_perfil
          }')">🔍</button>
        </td>
      `;
      tabelaPerfis.appendChild(tr);
    });

    renderizarPaginacao(perfisFiltrados.length);
  }

  function renderizarPaginacao(totalPerfis) {
    const totalPaginas = Math.ceil(totalPerfis / rowsPerPage);
    paginationContainer.innerHTML = "";

    for (let i = 1; i <= totalPaginas; i++) {
      const button = document.createElement("button");
      button.classList.add("page-btn");
      if (i === paginaAtual) {
        button.classList.add("active");
      }
      button.textContent = i;
      button.addEventListener("click", () => {
        paginaAtual = i;
        filtrarPerfis();
      });
      paginationContainer.appendChild(button);
    }
  }

  function filtrarPerfis() {
    const termoPesquisa = searchInput.value.toLowerCase();

    const perfisFiltrados = perfis.filter((perfil) => {
      return perfil.nome.toLowerCase().includes(termoPesquisa);
    });

    renderizarTabela(perfisFiltrados);
  }

  rowsPerPageSelect.addEventListener("change", () => {
    rowsPerPage = parseInt(rowsPerPageSelect.value);
    paginaAtual = 1;
    filtrarPerfis();
  });

  searchInput.addEventListener("input", () => {
    paginaAtual = 1;
    filtrarPerfis();
  });

  async function carregarPerfis() {
    const token = getToken();

    try {
      const response = await fetch("http://localhost:3000/api/profiles/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao carregar os perfis.");
      }

      const data = await response.json();
      perfis = data.perfis;
      perfis.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      filtrarPerfis();
    } catch (error) {
      console.error("Erro ao carregar os perfis:", error);
      alert("Erro ao carregar os perfis.");
    }
  }

  async function deletarPerfil(id_perfil) {
    const token = getToken();
    const confirmacao = confirm("Tem certeza que deseja excluir este perfil?");
    if (!confirmacao) return;

    try {
      if (id_perfil == 42) {
        alert("Não é possível deletar esse perfil");
        return;
      }
      const response = await fetch(
        `http://localhost:3000/api/profiles/deletar/${id_perfil}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao excluir o perfil.");
      }

      alert("Perfil excluído com sucesso!");
      carregarPerfis();
    } catch (error) {
      console.error("Erro ao excluir o perfil:", error);
      alert("Erro ao excluir o perfil.");
    }
  }
  carregarPerfis();

  window.carregarPerfis = carregarPerfis;
  window.deletarPerfil = deletarPerfil;
});

async function abrirModalDetalhar(idPerfil) {
  const token = getToken();
  try {
    const response = await fetch("http://localhost:3000/api/associations/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    const associacoes = data.associacoes;

    const perfisAssociados = associacoes.filter((a) => a.id_perfil == idPerfil);
    if (perfisAssociados.length === 0) {
      alert("Perfil sem permissões!");
      return;
    }

    const perfil = perfisAssociados[0].perfil.nome;

    const permissoes = perfisAssociados.map(
      (a) => `${a.permissao.modulo}: ${a.permissao.tipo_permissao}`
    );

    const permissoesHtml = permissoes.map((p) => `<li>${p}</li>`).join("");

    const conteudoModal = document.getElementById("conteudoModal");
    conteudoModal.innerHTML = `
      <table class="details-table">
        <tr>
          <td><strong>Perfil:</strong></td>
          <td>${perfil}</td>
        </tr>
        <tr>
          <td><strong>Permissões:</strong></td>
          <td>
            <ul>
              ${permissoesHtml}
            </ul>
          </td>
        </tr>        
      </table>
    `;

    const modal = document.getElementById("modalDetalhes");
    modal.style.display = "block";
  } catch (err) {
    console.error("Erro ao abrir modal.", err);
    alert("Erro ao carregar os detalhes do perfil.");
  }
}

function fecharModalDetalhar(modalId) {
  document.getElementById(modalId).style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".sidebar");
  const toggleButton = document.getElementById("sidebar-toggle");

  toggleButton.addEventListener("click", (event) => {
    event.stopPropagation();
    sidebar.classList.toggle("active");
  });

  document.addEventListener("click", (event) => {
    if (
      !sidebar.contains(event.target) &&
      !toggleButton.contains(event.target)
    ) {
      sidebar.classList.remove("active");
    }
  });
});

function parseJwt(token) {
  if (!token) return null;
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
      .join("")
  );
  return JSON.parse(jsonPayload);
}

function verificarPermissao(token, modulo, tipoPermissao) {
  const decodedToken = parseJwt(token);

  if (decodedToken && decodedToken.permissoes) {
    return decodedToken.permissoes.some(
      (permissao) =>
        permissao.modulo === modulo &&
        permissao.tipo_permissao === tipoPermissao
    );
  }
  return false;
}

document.addEventListener("DOMContentLoaded", () => {
  const token = getToken();
  const podeEditarPerfis = verificarPermissao(token, "Perfis", "Edição");

  const botaoCadastro = document.querySelector(".add-profile-btn");
  if (!podeEditarPerfis) {
    botaoCadastro.style.display = "none";
  }
});
