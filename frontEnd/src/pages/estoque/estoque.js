document.addEventListener("DOMContentLoaded", () => {
  const tabelaEstoques = document.getElementById("tabela-estoques");
  const searchInput = document.getElementById("search");
  const rowsPerPageSelect = document.getElementById("rows-per-page");
  const paginationContainer = document.querySelector(".pagination");

  let estoques = [];
  let paginaAtual = 1;
  let rowsPerPage = 5;

  function getToken() {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1];
  }

  function renderizarTabela(estoquesFiltrados) {
    tabelaEstoques.innerHTML = "";

    const inicio = (paginaAtual - 1) * rowsPerPage;
    const fim = inicio + rowsPerPage;

    const estoquesPaginados = estoquesFiltrados.slice(inicio, fim);
    const token = getToken();
    const podeEditarEstoque = verificarPermissao(token, "Lojas", "Edição");

    estoquesPaginados.forEach((estoque) => {
      const statusClass =
        estoque.estoque_atual < estoque.estoque_minimo
          ? "warning red"
          : estoque.estoque_atual < estoque.estoque_recomendado
          ? "warning"
          : "";

      const tr = document.createElement("tr");
      tr.innerHTML = `
          <td>${estoque.loja.nome}</td>
          <td>
            <span class="${statusClass}">${estoque.estoque_atual}${
        statusClass ? " ⚠️" : ""
      }</span>
          </td>
          <td>${estoque.estoque_minimo}</td>
          <td>${estoque.estoque_recomendado}</td>
          ${
            podeEditarEstoque
              ? `<td>
            <button class="edit-btn" onclick="abrirModalEdicao(${estoque.id_estoque})">✏️</button>
            <button class="delete-btn" onclick="deletarEstoque(${estoque.id_estoque})">🗑️</button>
          </td>`
              : ""
          }
          
        `;
      tabelaEstoques.appendChild(tr);
    });

    renderizarPaginacao(estoquesFiltrados.length);
  }

  function renderizarPaginacao(totalEstoques) {
    const totalPaginas = Math.ceil(totalEstoques / rowsPerPage);
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
        filtrarEstoques();
      });
      paginationContainer.appendChild(button);
    }
  }

  rowsPerPageSelect.addEventListener("change", () => {
    rowsPerPage = parseInt(rowsPerPageSelect.value);
    paginaAtual = 1;
    filtrarEstoques();
  });

  searchInput.addEventListener("input", () => {
    paginaAtual = 1;
    filtrarEstoques();
  });

  async function carregarEstoques() {
    const token = getToken();

    try {
      const response = await fetch("http://localhost:3000/api/stocks/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        alert("Sessão iniciada em outro lugar.")
        window.location.href = "/frontEnd/src/pages/login/index.html";
      }

      const data = await response.json();
      estoques = data.estoques;

      estoques = data.estoques.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });
      filtrarEstoques();
    } catch (error) {
      console.error("Erro ao carregar estoques:", error);
    }
  }

  function filtrarEstoques() {
    const termoPesquisa = searchInput.value.toLowerCase();
    const estoquesFiltrados = estoques.filter((estoque) => {
      return (
        estoque.loja.nome.toLowerCase().includes(termoPesquisa) ||
        String(estoque.estoque_atual).toLowerCase().includes(termoPesquisa) ||
        String(estoque.estoque_recomendado)
          .toLowerCase()
          .includes(termoPesquisa) ||
        String(estoque.estoque_minimo).toLowerCase().includes(termoPesquisa)
      );
    });

    renderizarTabela(estoquesFiltrados);
  }

  rowsPerPageSelect.addEventListener("change", () => {
    rowsPerPage = parseInt(rowsPerPageSelect.value);
    paginaAtual = 1;
    filtrarEstoques();
  });

  searchInput.addEventListener("input", () => {
    paginaAtual = 1;
    filtrarEstoques();
  });

  async function deletarEstoque(idEstoque) {
    const confirmacao = confirm("Tem certeza que deseja deletar este estoque?");
    if (!confirmacao) return;

    const token = getToken();
    try {
      const response = await fetch(
        `http://localhost:3000/api/stocks/deletar/${idEstoque}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao deletar estoque.");
      }

      alert("Estoque deletado com sucesso!");
      carregarEstoques();
    } catch (error) {
      console.error("Erro ao deletar estoque:", error);
      alert("Erro ao deletar estoque.");
    }
  }
  carregarEstoques();
  window.deletarEstoque = deletarEstoque;
});

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
  const podeEditarEstoque = verificarPermissao(token, "Lojas", "Edição");

  const botaoCadastro = document.querySelector(".add-estoque-btn");
  const qtdRecom = document.querySelector(".qtdRecom");
  const colunaAcoes = document.querySelector(".action-column");
  if (!podeEditarEstoque) {
    botaoCadastro.style.display = "none";
    colunaAcoes.style.display = "none";
    qtdRecom.style.borderTopRightRadius = "8px";
    qtdRecom.style.borderBottomRightRadius = "8px";
  }
});
