document.addEventListener("DOMContentLoaded", () => {
  const tabelaLojas = document.getElementById("tabela-lojas");
  const paginationContainer = document.querySelector(".pagination");
  const searchInput = document.getElementById("search");
  const rowsPerPageSelect = document.getElementById("rows-per-page");

  let lojas = [];
  let paginaAtual = 1;
  let rowsPerPage = 5;

  function getToken() {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1];
  }

  function renderizarTabela(lojasFiltrados) {
    tabelaLojas.innerHTML = "";

    const inicio = (paginaAtual - 1) * rowsPerPage;
    const fim = inicio + rowsPerPage;

    const lojasPaginadas = lojasFiltrados.slice(inicio, fim);
    const token = getToken();
    const podeEditarLoja = verificarPermissao(token, "Lojas", "Edição");

    lojasPaginadas.forEach((loja) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${loja.cod_loja}</td>
        <td>${loja.nome}</td>
        <td>${loja.cidade}</td>
        ${
          podeEditarLoja
            ? `<td>
          <button class="edit-btn" onclick="abrirModalEdicao(${loja.id_loja})">✏️</button>
          <button class="delete-btn" onclick="deletarLoja(${loja.id_loja})">🗑️</button>
        </td>`
            : ""
        }
        
      `;
      tabelaLojas.appendChild(tr);
    });

    renderizarPaginacao(lojasFiltrados.length);
  }

  function renderizarPaginacao(totalLojas) {
    const totalPaginas = Math.ceil(totalLojas / rowsPerPage);
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
        filtrarLojas();
      });
      paginationContainer.appendChild(button);
    }
  }

  rowsPerPageSelect.addEventListener("change", () => {
    rowsPerPage = parseInt(rowsPerPageSelect.value);
    paginaAtual = 1;
    filtrarLojas();
  });

  searchInput.addEventListener("input", () => {
    paginaAtual = 1;
    filtrarLojas();
  });

  async function carregarLojas() {
    const token = getToken();

    try {
      const response = await fetch("http://localhost:3000/api/stores/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao carregar as lojas.");
      }

      const data = await response.json();
      lojas = data.lojas;
      lojas = data.lojas.sort((a, b) => {
        return new Date(b.updated_at) - new Date(a.updated_at);
      });
      filtrarLojas(lojas);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar as lojas.");
    }
  }

  function filtrarLojas() {
    const termoPesquisa = searchInput.value.toLowerCase();

    const lojasFiltradas = lojas.filter((loja) => {
      return (
        loja.nome.toLowerCase().includes(termoPesquisa) ||
        loja.cod_loja.toLowerCase().includes(termoPesquisa) ||
        loja.cidade.toLowerCase().includes(termoPesquisa)
      );
    });

    renderizarTabela(lojasFiltradas);
  }

  async function deletarLoja(idLoja) {
    const token = getToken();
    const confirmacao = confirm("Tem certeza que deseja deletar esta loja?");
    if (!confirmacao) return;

    try {
      if (idLoja == 9) {
        alert("Não é possível deletar essa loja");
        return;
      }
      const response = await fetch(
        `http://localhost:3000/api/stores/deletar/${idLoja}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Erro ao deletar a loja.");

      alert("Loja deletada com sucesso!");
      carregarLojas();
    } catch (error) {
      console.error(error);
      alert("Erro ao deletar a loja.");
    }
  }

  carregarLojas();
  window.deletarLoja = deletarLoja;
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

function getToken() {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("authToken="))
    ?.split("=")[1];
}

document.addEventListener("DOMContentLoaded", () => {
  const token = getToken();
  const podeEditarLoja = verificarPermissao(token, "Lojas", "Edição");

  const botaoCadastro = document.querySelector(".add-loja-btn");
  const cidade = document.querySelector(".cidade-column");
  const colunaAcoes = document.querySelector(".action-column");
  if (!podeEditarLoja) {
    botaoCadastro.style.display = "none";
    colunaAcoes.style.display = "none";
    cidade.style.borderTopRightRadius = "8px";
    cidade.style.borderBottomRightRadius = "8px";
  }
});
